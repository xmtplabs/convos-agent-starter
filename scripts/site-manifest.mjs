import { createHash } from "node:crypto";
import { lstat, readFile, readdir } from "node:fs/promises";
import { extname, relative, resolve, sep } from "node:path";

export const MANIFEST_FILE = "convos.site.json";
export const COMPATIBILITY_DATE = "2026-07-23";
export const COMPATIBILITY_FLAGS = Object.freeze(["nodejs_compat"]);
export const MAIN_MODULE = "dist/server/index.js";
const LIMITS = {
  manifestBytes: 1024 * 1024,
  entries: 1_000,
  pathBytes: 1_024,
  contentTypeBytes: 256,
  moduleBytes: 8 * 1024 * 1024,
  totalModuleBytes: 8 * 1024 * 1024,
  assetBytes: 25 * 1024 * 1024,
  totalAssetBytes: 512 * 1024 * 1024,
};
const encoder = new TextEncoder();

const MIME_TYPES = new Map([
  [".avif", "image/avif"],
  [".bmp", "image/bmp"],
  [".css", "text/css; charset=utf-8"],
  [".csv", "text/csv; charset=utf-8"],
  [".gif", "image/gif"],
  [".htm", "text/html; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpeg", "image/jpeg"],
  [".jpg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".map", "application/json; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".mp3", "audio/mpeg"],
  [".mp4", "video/mp4"],
  [".ogg", "audio/ogg"],
  [".otf", "font/otf"],
  [".pdf", "application/pdf"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".ttf", "font/ttf"],
  [".txt", "text/plain; charset=utf-8"],
  [".wasm", "application/wasm"],
  [".webm", "video/webm"],
  [".webmanifest", "application/manifest+json; charset=utf-8"],
  [".webp", "image/webp"],
  [".woff", "font/woff"],
  [".woff2", "font/woff2"],
  [".xml", "application/xml; charset=utf-8"],
]);

const compare = (left, right) => (left < right ? -1 : left > right ? 1 : 0);
const digest = (algorithm, value) =>
  createHash(algorithm).update(value).digest("hex");
const sha256 = (value) => digest("sha256", value);
const gitBlobSha = (value) =>
  createHash("sha1")
    .update(`blob ${value.byteLength}\0`)
    .update(value)
    .digest("hex");

function slashPath(value) {
  return sep === "/" ? value : value.split(sep).join("/");
}

function assertSafeRelativePath(value, label) {
  if (
    value.startsWith("/") ||
    value.includes("\\") ||
    /[\0-\x1f\x7f]/.test(value) ||
    value.split("/").some((part) => part === "" || part === "." || part === "..") ||
    encoder.encode(value).byteLength > LIMITS.pathBytes
  ) {
    throw new Error(`invalid ${label}: ${JSON.stringify(value)}`);
  }
}

async function walk(directory) {
  const output = [];
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => compare(left.name, right.name));
  for (const entry of entries) {
    const path = resolve(directory, entry.name);
    const info = await lstat(path);
    if (info.isSymbolicLink()) {
      throw new Error(`artifact entry must not be a symlink: ${path}`);
    }
    if (info.isDirectory()) {
      output.push(...(await walk(path)));
      continue;
    }
    if (!info.isFile()) {
      throw new Error(`artifact entry must be a regular file: ${path}`);
    }
    output.push(path);
  }
  return output;
}

function moduleType(path) {
  const extension = extname(path).toLowerCase();
  if (extension === ".js" || extension === ".mjs") return "js";
  if (extension === ".css" || extension === ".txt") return "text";
  throw new Error(
    `unsupported server module output: ${path}`,
  );
}

async function inventory(root, directoryName, kind) {
  const directory = resolve(root, directoryName);
  const paths = await walk(directory);
  return Promise.all(
    paths.map(async (path) => {
      const bytes = await readFile(path);
      const repoPath = slashPath(relative(root, path));
      assertSafeRelativePath(repoPath, "artifact repo path");
      const common = {
        repoPath,
        size: bytes.byteLength,
        gitBlobSha: gitBlobSha(bytes),
        sha256: sha256(bytes),
      };
      if (kind === "module") {
        return {
          repoPath,
          moduleName: repoPath,
          type: moduleType(path),
          size: common.size,
          gitBlobSha: common.gitBlobSha,
          sha256: common.sha256,
        };
      }
      return {
        repoPath,
        urlPath: `/${slashPath(relative(directory, path))}`,
        contentType:
          MIME_TYPES.get(extname(path).toLowerCase()) ??
          "application/octet-stream",
        size: common.size,
        gitBlobSha: common.gitBlobSha,
        sha256: common.sha256,
      };
    }),
  );
}

function artifactMaterial(manifest) {
  return JSON.stringify({
    schemaVersion: 1,
    mainModule: manifest.mainModule,
    modules: manifest.modules.map(({ moduleName, type, size, sha256: hash }) => [
      moduleName,
      type,
      size,
      hash,
    ]),
    assets: manifest.assets.map(
      ({ urlPath, contentType, size, sha256: hash }) => [
        urlPath,
        contentType,
        size,
        hash,
      ],
    ),
    compatibilityDate: manifest.compatibilityDate,
    compatibilityFlags: manifest.compatibilityFlags,
  });
}

export async function createSiteManifest(root) {
  const modules = (await inventory(root, "dist", "module")).sort((left, right) =>
    compare(left.moduleName, right.moduleName),
  );
  const assets = (await inventory(root, "public", "asset")).sort((left, right) =>
    compare(left.urlPath, right.urlPath),
  );
  if (!modules.some((entry) => entry.moduleName === MAIN_MODULE)) {
    throw new Error(`missing React Router server entry: ${MAIN_MODULE}`);
  }
  if (modules.length + assets.length > LIMITS.entries) {
    throw new Error("artifact exceeds the 1,000 entry platform limit");
  }
  for (const entry of modules) {
    assertSafeRelativePath(entry.moduleName, "module name");
    if (entry.size > LIMITS.moduleBytes) {
      throw new Error(`worker module exceeds 8 MiB: ${entry.repoPath}`);
    }
  }
  for (const entry of assets) {
    assertSafeRelativePath(entry.urlPath.slice(1), "asset URL path");
    if (entry.size > LIMITS.assetBytes) {
      throw new Error(`asset exceeds 25 MiB: ${entry.repoPath}`);
    }
    if (encoder.encode(entry.contentType).byteLength > LIMITS.contentTypeBytes) {
      throw new Error(`asset content type is too long: ${entry.repoPath}`);
    }
  }
  const totalModuleBytes = modules.reduce((total, entry) => total + entry.size, 0);
  const totalAssetBytes = assets.reduce((total, entry) => total + entry.size, 0);
  if (totalModuleBytes > LIMITS.totalModuleBytes) {
    throw new Error("worker modules exceed the 8 MiB aggregate platform limit");
  }
  if (totalAssetBytes > LIMITS.totalAssetBytes) {
    throw new Error("assets exceed the 512 MiB aggregate platform limit");
  }
  const manifest = {
    schemaVersion: 1,
    gitObjectFormat: "sha1",
    compatibilityDate: COMPATIBILITY_DATE,
    compatibilityFlags: [...COMPATIBILITY_FLAGS],
    mainModule: MAIN_MODULE,
    modules,
    assets,
  };
  return {
    ...manifest,
    artifactDigest: sha256(artifactMaterial(manifest)),
  };
}

export function serializeSiteManifest(manifest) {
  const bytes = `${JSON.stringify(manifest, null, 2)}\n`;
  if (encoder.encode(bytes).byteLength > LIMITS.manifestBytes) {
    throw new Error("convos.site.json exceeds the 1 MiB platform limit");
  }
  return bytes;
}

export async function verifySiteManifest(root, manifestBytes) {
  let actual;
  try {
    actual = JSON.parse(manifestBytes);
  } catch {
    throw new Error(`${MANIFEST_FILE} is not valid JSON`);
  }
  const expectedBytes = serializeSiteManifest(await createSiteManifest(root));
  if (manifestBytes !== expectedBytes) {
    throw new Error(
      `${MANIFEST_FILE} does not exactly match the complete dist/ and public/ inventory`,
    );
  }
  if (
    actual.schemaVersion !== 1 ||
    actual.gitObjectFormat !== "sha1" ||
    actual.mainModule !== MAIN_MODULE
  ) {
    throw new Error(`${MANIFEST_FILE} has an unsupported deployment shape`);
  }
  return actual;
}
