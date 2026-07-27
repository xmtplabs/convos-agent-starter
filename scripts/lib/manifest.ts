import { createHash } from "node:crypto";
import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";
import { canonicalJson, compareCodePoints } from "./canonical.js";
import {
  caseFoldedPath,
  isSafeRelativePath,
  loadSiteConfig,
  type SiteConfig,
} from "./config.js";
import { SiteError } from "./error.js";

const EXACT_VERSION =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?$/;
const PACKAGE_NAME =
  /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;
const RESERVED_URL_PREFIX = "/__convos";
export const WORKSPACE_VALUE_MAX_BYTES = 1_900_000;
const LIMITS = {
  entries: 1_000,
  sourceFileBytes: WORKSPACE_VALUE_MAX_BYTES,
  totalSourceBytes: 32 * 1024 * 1024,
  pageBytes: 256 * 1024,
  totalPageBytes: 8 * 1024 * 1024,
  assetBytes: 25 * 1024 * 1024,
  totalAssetBytes: 512 * 1024 * 1024,
  promptBytes: 1 * 1024 * 1024,
  catalogBytes: 1 * 1024 * 1024,
  lockedPackages: 1_000,
} as const;

const sha256 = (value: Uint8Array | string) =>
  createHash("sha256").update(value).digest("hex");
const digestCanonical = (value: unknown) => sha256(canonicalJson(value));

export type SourceEntry = {
  path: string;
  size: number;
  gitBlobSha: string;
  sha256: string;
};
export type PageEntry = SourceEntry & { route: string };
export type AssetEntry = SourceEntry & {
  urlPath: string;
  contentType: string;
};
export type LockedPackage = {
  name: string;
  version: string;
  integrity: `sha512-${string}`;
  dependencies: Record<string, string>;
};
export type SiteManifestV2 = {
  schemaVersion: 2;
  gitObjectFormat: "sha1";
  runtime: SiteConfig;
  dependencies: {
    dependencyDigest: string;
    direct: Record<string, string>;
    packages: LockedPackage[];
  };
  code: { bundleDigest: string; files: SourceEntry[] };
  prompt: SourceEntry & {
    path: "generated/openui-system-prompt.txt";
    promptDigest: string;
  };
  catalog: SourceEntry & {
    path: "generated/openui-catalog.json";
    catalogDigest: string;
  };
  pages: PageEntry[];
  assets: AssetEntry[];
  contentDigest: string;
  deploymentDigest: string;
};

async function inventory(root: string, directory: string): Promise<string[]> {
  const base = resolve(root, directory);
  const entries: string[] = [];
  async function visit(current: string) {
    for (const item of await readdir(current, { withFileTypes: true })) {
      const full = resolve(current, item.name);
      const path = relative(root, full).split(sep).join("/");
      if (item.isSymbolicLink()) {
        throw new SiteError(
          "invalid_manifest",
          "manifest",
          `symlink is not allowed: ${path}`,
        );
      }
      if (item.isDirectory()) await visit(full);
      else if (item.isFile()) entries.push(path);
      else {
        throw new SiteError(
          "invalid_manifest",
          "manifest",
          `unsupported file: ${path}`,
        );
      }
    }
  }
  try {
    await visit(base);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
  return entries.sort(compareCodePoints);
}

async function sourceEntry(
  root: string,
  path: string,
  maximumSize: number,
): Promise<SourceEntry> {
  if (!isSafeRelativePath(path)) {
    throw new SiteError(
      "invalid_manifest",
      "manifest",
      `unsafe path: ${path}`,
    );
  }
  const fullPath = resolve(root, path);
  const metadata = await lstat(fullPath);
  if (
    !fullPath.startsWith(`${root}${sep}`) ||
    metadata.isSymbolicLink() ||
    !metadata.isFile() ||
    metadata.size > maximumSize
  ) {
    throw new SiteError(
      "invalid_manifest",
      "manifest",
      `invalid source file: ${path}`,
    );
  }
  const bytes = await readFile(fullPath);
  const gitBlobSha = createHash("sha1")
    .update(`blob ${bytes.byteLength}\0`)
    .update(bytes)
    .digest("hex");
  return {
    path,
    size: bytes.byteLength,
    gitBlobSha,
    sha256: sha256(bytes),
  };
}

function routeForPage(path: string): string {
  if (
    !path.startsWith("pages/") ||
    !path.endsWith(".openui") ||
    !isSafeRelativePath(path) ||
    /[\[\]:$]/.test(path)
  ) {
    throw new SiteError(
      "invalid_page",
      "page",
      `invalid page path: ${path}`,
    );
  }
  const stem = path.slice("pages/".length, -".openui".length);
  const route =
    stem === "index"
      ? "/"
      : stem.endsWith("/index")
        ? `/${stem.slice(0, -"/index".length)}`
        : `/${stem}`;
  if (!isRoute(route)) {
    throw new SiteError(
      "invalid_page",
      "page",
      `invalid page route: ${route}`,
    );
  }
  return route;
}

function isRoute(value: string): boolean {
  return (
    value === "/" ||
    (isUrlPath(value) &&
      value !== RESERVED_URL_PREFIX &&
      !value.startsWith(`${RESERVED_URL_PREFIX}/`))
  );
}

function isUrlPath(value: string): boolean {
  return (
    value.startsWith("/") &&
    value !== "/" &&
    isSafeRelativePath(value.slice(1)) &&
    !/[?#%]/.test(value)
  );
}

const contentTypes: Record<string, string> = {
  ".css": "text/css",
  ".gif": "image/gif",
  ".html": "text/html",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain",
  ".webp": "image/webp",
};

type LockSnapshot = {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  optionalDependencies: Record<string, string>;
};

function parseLockfile(
  lock: string,
  expectedDirect: Record<string, string>,
): LockedPackage[] {
  const importerBlock =
    /\nimporters:\n([\s\S]*?)\npackages:\n/.exec(`\n${lock}`)?.[1];
  const packageBlock =
    /\npackages:\n([\s\S]*?)\nsnapshots:\n/.exec(`\n${lock}`)?.[1];
  const snapshotBlock = /\nsnapshots:\n([\s\S]*)$/.exec(`\n${lock}`)?.[1];
  if (!importerBlock || !packageBlock || !snapshotBlock) {
    throw new SiteError(
      "invalid_dependency",
      "manifest",
      "unsupported pnpm lockfile",
    );
  }

  const integrityByPackage = new Map<string, `sha512-${string}`>();
  let packageKey: string | undefined;
  for (const line of packageBlock.split("\n")) {
    const header = /^ {2}([^ ].+):(?: \{\})?$/.exec(line);
    if (header) {
      packageKey = unquote(header[1]);
      continue;
    }
    const integrity =
      /^    resolution: \{integrity: (sha512-[A-Za-z0-9+/=]+)\}$/.exec(
        line,
      );
    if (packageKey && integrity) {
      const identity = parsePackageIdentity(packageKey);
      if (identity) {
        integrityByPackage.set(
          `${identity.name}@${identity.version}`,
          integrity[1] as `sha512-${string}`,
        );
      }
    }
  }

  const snapshots = new Map<string, LockSnapshot>();
  let snapshotKey: string | undefined;
  let current: LockSnapshot | undefined;
  let dependencyGroup: "dependencies" | "optionalDependencies" | undefined;
  const finishSnapshot = () => {
    if (!snapshotKey || !current) return;
    if (snapshots.has(snapshotKey)) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        `duplicate lockfile snapshot: ${snapshotKey}`,
      );
    }
    for (const name of Object.keys(current.dependencies)) {
      if (current.optionalDependencies[name] !== undefined) {
        throw new SiteError(
          "invalid_dependency",
          "manifest",
          `dependency is both normal and optional: ${name}`,
        );
      }
    }
    snapshots.set(snapshotKey, current);
  };
  for (const line of snapshotBlock.split("\n")) {
    const header = /^ {2}([^ ].+):(?: \{\})?$/.exec(line);
    if (header) {
      finishSnapshot();
      snapshotKey = unquote(header[1]);
      const identity = parsePackageIdentity(snapshotKey);
      current = identity
        ? { ...identity, dependencies: {}, optionalDependencies: {} }
        : undefined;
      dependencyGroup = undefined;
      continue;
    }
    if (/^    dependencies:$/.test(line)) {
      dependencyGroup = "dependencies";
      continue;
    }
    if (/^    optionalDependencies:$/.test(line)) {
      dependencyGroup = "optionalDependencies";
      continue;
    }
    if (/^    \S/.test(line)) {
      dependencyGroup = undefined;
      continue;
    }
    const group = dependencyGroup;
    const dependency = group
      ? /^      (.+): (.+)$/.exec(line)
      : undefined;
    if (current && group && dependency) {
      const name = unquote(dependency[1]);
      if (current[group][name] !== undefined) {
        throw new SiteError(
          "invalid_dependency",
          "manifest",
          `duplicate locked dependency: ${name}`,
        );
      }
      current[group][name] = unquote(dependency[2]);
    }
  }
  finishSnapshot();

  const importerVersions = parseProductionImporter(importerBlock);
  for (const [name, version] of Object.entries(expectedDirect)) {
    const locked = importerVersions[name];
    if (!locked || stripPeerContext(locked) !== version) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        `lockfile does not resolve ${name}@${version}`,
      );
    }
  }
  if (
    Object.keys(importerVersions).some(
      (name) => expectedDirect[name] === undefined,
    )
  ) {
    throw new SiteError(
      "invalid_dependency",
      "manifest",
      "lockfile contains an unexpected direct dependency",
    );
  }

  const pending = Object.entries(importerVersions).map(
    ([name, version]) => `${name}@${version}`,
  );
  const visitedSnapshots = new Set<string>();
  const packagesByName = new Map<string, LockedPackage>();
  while (pending.length > 0) {
    const snapshotId = pending.pop()!;
    if (visitedSnapshots.has(snapshotId)) continue;
    visitedSnapshots.add(snapshotId);
    const snapshot = snapshots.get(snapshotId);
    if (!snapshot) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        `lockfile snapshot is missing: ${snapshotId}`,
      );
    }
    const integrity = integrityByPackage.get(
      `${snapshot.name}@${snapshot.version}`,
    );
    if (!integrity || !isSha512Integrity(integrity)) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        `integrity is missing for ${snapshot.name}@${snapshot.version}`,
      );
    }
    const dependencies: Record<string, string> = {};
    for (const [name, rawVersion] of Object.entries({
      ...snapshot.dependencies,
      ...snapshot.optionalDependencies,
    })) {
      const version = stripPeerContext(rawVersion);
      if (!PACKAGE_NAME.test(name) || !isExactVersion(version)) {
        throw new SiteError(
          "invalid_dependency",
          "manifest",
          `invalid locked dependency ${name}`,
        );
      }
      dependencies[name] = version;
      const target = `${name}@${rawVersion}`;
      if (!visitedSnapshots.has(target)) pending.push(target);
    }
    const existing = packagesByName.get(snapshot.name);
    if (existing) {
      if (
        existing.version !== snapshot.version ||
        canonicalJson(existing.dependencies) !== canonicalJson(dependencies)
      ) {
        throw new SiteError(
          "invalid_dependency",
          "manifest",
          `multiple versions or resolutions of ${snapshot.name} are unsupported`,
        );
      }
      continue;
    }
    packagesByName.set(snapshot.name, {
      name: snapshot.name,
      version: snapshot.version,
      integrity,
      dependencies,
    });
    if (packagesByName.size > LIMITS.lockedPackages) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        "dependency graph is too large",
      );
    }
  }

  return [...packagesByName.values()].sort((left, right) =>
    compareCodePoints(left.name, right.name),
  );
}

function parseProductionImporter(block: string): Record<string, string> {
  const versions: Record<string, string> = {};
  let inRoot = false;
  let inDependencies = false;
  let dependencyName: string | undefined;
  for (const line of block.split("\n")) {
    if (/^ {2}\.:$/.test(line)) {
      inRoot = true;
      continue;
    }
    if (inRoot && /^ {2}[^ ]/.test(line)) break;
    if (!inRoot) continue;
    if (/^ {4}dependencies:$/.test(line)) {
      inDependencies = true;
      continue;
    }
    if (/^ {4}\S/.test(line)) {
      inDependencies = false;
      dependencyName = undefined;
      continue;
    }
    if (!inDependencies) continue;
    const dependency = /^ {6}(.+):$/.exec(line);
    if (dependency) {
      dependencyName = unquote(dependency[1]);
      continue;
    }
    const version = /^ {8}version: (.+)$/.exec(line);
    if (dependencyName && version) {
      versions[dependencyName] = unquote(version[1]);
    }
  }
  return versions;
}

function parsePackageIdentity(
  value: string,
): { name: string; version: string } | undefined {
  const withoutPeers = value.replace(/\(.+$/, "");
  const separator = withoutPeers.lastIndexOf("@");
  if (separator <= 0) return undefined;
  const name = withoutPeers.slice(0, separator);
  const version = withoutPeers.slice(separator + 1);
  return PACKAGE_NAME.test(name) && isExactVersion(version)
    ? { name, version }
    : undefined;
}

function stripPeerContext(value: string): string {
  return value.replace(/\(.+$/, "");
}

function unquote(value: string): string {
  return value.replace(/^['"]|['"]$/g, "");
}

function isExactVersion(value: string): boolean {
  const match = EXACT_VERSION.exec(value);
  if (!match) return false;
  const prerelease = match[4];
  return (
    prerelease === undefined ||
    prerelease
      .split(".")
      .every(
        (part) =>
          !/^\d+$/.test(part) || part === "0" || !part.startsWith("0"),
      )
  );
}

function isSha512Integrity(value: string): boolean {
  if (!value.startsWith("sha512-")) return false;
  const encoded = value.slice("sha512-".length);
  if (
    !/^(?:[A-Za-z0-9+/]{4}){21}[A-Za-z0-9+/]{2}==$/.test(encoded)
  ) {
    return false;
  }
  const decoded = Buffer.from(encoded, "base64");
  return decoded.byteLength === 64 && decoded.toString("base64") === encoded;
}

function fileDigestInput(entry: SourceEntry) {
  return { path: entry.path, size: entry.size, sha256: entry.sha256 };
}

function validateInventory(
  runtime: SiteConfig,
  source: SourceEntry[],
  prompt: SourceEntry,
  catalog: SourceEntry,
  pages: PageEntry[],
  assets: AssetEntry[],
) {
  if (
    source.length + pages.length + assets.length + 2 > LIMITS.entries ||
    sum(source) > LIMITS.totalSourceBytes ||
    sum(pages) > LIMITS.totalPageBytes ||
    sum(assets) > LIMITS.totalAssetBytes
  ) {
    throw new SiteError(
      "invalid_manifest",
      "manifest",
      "manifest inventory exceeds platform limits",
    );
  }
  for (const path of [
    runtime.server,
    runtime.client,
    ...runtime.styles,
  ]) {
    if (!source.some((file) => file.path === path)) {
      throw new SiteError(
        "invalid_manifest",
        "manifest",
        `runtime path absent from source inventory: ${path}`,
      );
    }
  }
  if (pages.filter((page) => page.route === "/").length !== 1) {
    throw new SiteError(
      "invalid_page",
      "page",
      "pages must contain exactly one homepage",
    );
  }
  assertUniqueCanonical(source.map((file) => file.path), "source paths");
  assertUniqueCanonical(pages.map((page) => page.route), "page routes");
  assertUniqueCanonical(assets.map((asset) => asset.urlPath), "asset URLs");
  assertUniqueCanonical(
    [
      ...source.map((file) => file.path),
      prompt.path,
      catalog.path,
      ...pages.map((page) => page.path),
      ...assets.map((asset) => asset.path),
    ],
    "manifest paths",
  );
  const routes = new Set(
    pages.map((page) => caseFoldedPath(page.route)),
  );
  for (const asset of assets) {
    if (
      routes.has(caseFoldedPath(asset.urlPath)) ||
      asset.urlPath === RESERVED_URL_PREFIX ||
      asset.urlPath.startsWith(`${RESERVED_URL_PREFIX}/`)
    ) {
      throw new SiteError(
        "invalid_manifest",
        "manifest",
        `asset URL conflicts with a page route: ${asset.urlPath}`,
      );
    }
  }
  assertConsistentIdentity([...source, prompt, catalog, ...pages, ...assets]);
}

function assertUniqueCanonical(values: string[], label: string) {
  if (new Set(values.map(caseFoldedPath)).size !== values.length) {
    throw new SiteError(
      "invalid_manifest",
      "manifest",
      `${label} must be unique and case-safe`,
    );
  }
}

function assertConsistentIdentity(entries: SourceEntry[]) {
  const git = new Map<string, string>();
  const content = new Map<string, string>();
  for (const entry of entries) {
    const identity = `${entry.sha256}:${entry.size}`;
    const reverse = `${entry.gitBlobSha}:${entry.size}`;
    if (
      (git.has(entry.gitBlobSha) &&
        git.get(entry.gitBlobSha) !== identity) ||
      (content.has(entry.sha256) && content.get(entry.sha256) !== reverse)
    ) {
      throw new SiteError(
        "invalid_manifest",
        "manifest",
        "conflicting repeated content identity",
      );
    }
    git.set(entry.gitBlobSha, identity);
    content.set(entry.sha256, reverse);
  }
}

function sum(entries: SourceEntry[]): number {
  return entries.reduce((total, entry) => total + entry.size, 0);
}

export async function createManifest(
  root: string,
): Promise<SiteManifestV2> {
  const runtime = await loadSiteConfig(root);
  const packageJson = JSON.parse(
    await readFile(resolve(root, "package.json"), "utf8"),
  ) as {
    dependencies?: Record<string, string>;
    devDependencies?: Record<string, string>;
  };
  const direct = { ...(packageJson.dependencies ?? {}) };
  for (const [name, version] of Object.entries({
    ...direct,
    ...(packageJson.devDependencies ?? {}),
  })) {
    if (!PACKAGE_NAME.test(name) || !isExactVersion(version)) {
      throw new SiteError(
        "invalid_dependency",
        "manifest",
        `dependency must be exact: ${name}`,
      );
    }
  }
  const packages = parseLockfile(
    await readFile(resolve(root, "pnpm-lock.yaml"), "utf8"),
    direct,
  );
  const dependencyDigest = digestCanonical({ direct, packages });

  const codePaths = await inventory(root, "src");
  const codeFiles = await Promise.all(
    codePaths.map((path) =>
      sourceEntry(root, path, LIMITS.sourceFileBytes),
    ),
  );
  const catalogEntry = await sourceEntry(
    root,
    "generated/openui-catalog.json",
    LIMITS.catalogBytes,
  );
  const catalog = {
    ...catalogEntry,
    path: "generated/openui-catalog.json" as const,
    catalogDigest: digestCanonical(
      JSON.parse(await readFile(resolve(root, "generated/openui-catalog.json"), "utf8")),
    ),
  };
  const bundleDigest = digestCanonical({
    runtime,
    dependencyDigest,
    catalogDigest: catalog.catalogDigest,
    files: codeFiles
      .slice()
      .sort((left, right) => compareCodePoints(left.path, right.path))
      .map(fileDigestInput),
  });

  const promptEntry = await sourceEntry(
    root,
    "generated/openui-system-prompt.txt",
    LIMITS.promptBytes,
  );
  const prompt = {
    ...promptEntry,
    path: "generated/openui-system-prompt.txt" as const,
    promptDigest: promptEntry.sha256,
  };
  const pagePaths = await inventory(root, "pages");
  if (pagePaths.some((path) => !path.endsWith(".openui"))) {
    throw new SiteError(
      "invalid_page",
      "page",
      "pages may contain only .openui files",
    );
  }
  const pages = (
    await Promise.all(
      pagePaths.map(async (path) => ({
        ...(await sourceEntry(root, path, LIMITS.pageBytes)),
        route: routeForPage(path),
      })),
    )
  ).sort((left, right) => compareCodePoints(left.route, right.route));

  const assets = (
    await Promise.all(
      (await inventory(root, "assets")).map(async (path) => {
        const urlPath = `/assets/${path.slice("assets/".length)}`;
        if (!isUrlPath(urlPath)) {
          throw new SiteError(
            "invalid_manifest",
            "manifest",
            `invalid asset URL: ${urlPath}`,
          );
        }
        return {
          ...(await sourceEntry(root, path, LIMITS.assetBytes)),
          urlPath,
          contentType:
            contentTypes[extname(path).toLowerCase()] ??
            "application/octet-stream",
        };
      }),
    )
  ).sort((left, right) => compareCodePoints(left.urlPath, right.urlPath));

  validateInventory(runtime, codeFiles, prompt, catalog, pages, assets);
  const contentDigest = digestCanonical({
    pages: pages.map(({ route, ...file }) => ({
      route,
      ...fileDigestInput(file),
    })),
    assets: assets.map(({ urlPath, contentType, ...file }) => ({
      urlPath,
      contentType,
      ...fileDigestInput(file),
    })),
  });
  const deploymentDigest = digestCanonical({
    schemaVersion: 2,
    gitObjectFormat: "sha1",
    bundleDigest,
    promptDigest: prompt.promptDigest,
    catalogDigest: catalog.catalogDigest,
    contentDigest,
  });

  return {
    schemaVersion: 2,
    gitObjectFormat: "sha1",
    runtime,
    dependencies: { dependencyDigest, direct, packages },
    code: { bundleDigest, files: codeFiles },
    prompt,
    catalog,
    pages,
    assets,
    contentDigest,
    deploymentDigest,
  };
}

export const serializeManifest = (manifest: SiteManifestV2) =>
  `${canonicalJson(manifest)}\n`;
