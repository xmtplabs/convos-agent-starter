import { lstat, readFile } from "node:fs/promises";
import { resolve, sep } from "node:path";
import { compareCodePoints } from "./canonical.js";
import { SiteError } from "./error.js";

export type SiteConfig = {
  server: string;
  client: string;
  compatibilityDate: string;
  compatibilityFlags: string[];
};

const SAFE_RELATIVE_PATH =
  /^(?!\/)(?!.*(?:^|\/)\.{1,2}(?:\/|$))(?!.*\/\/)(?!.*[*?\[\]{}])[^\\]+$/;
const ASCII_PATH = /^[\x20-\x7e]+$/;
const ALLOWED_COMPATIBILITY_FLAGS = new Set(["nodejs_compat"]);
const MIN_COMPATIBILITY_DATE = "2025-01-01";
const MAX_COMPATIBILITY_DATE = "2026-07-24";
const PATH_BYTES = 1_024;
const utf8 = new TextEncoder();

export function assertRepositoryPath(
  value: unknown,
  field: string,
): asserts value is string {
  if (typeof value !== "string" || !isSafeRelativePath(value)) {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      `invalid ${field}`,
    );
  }
}

export function isSafeRelativePath(value: string): boolean {
  return (
    SAFE_RELATIVE_PATH.test(value) &&
    ASCII_PATH.test(value) &&
    !/^[A-Za-z]:\//.test(value) &&
    !/[#%]/.test(value) &&
    value === value.normalize("NFC") &&
    value
      .split("/")
      .every((part) => part.length > 0 && part === part.trim()) &&
    utf8.encode(value).byteLength <= PATH_BYTES
  );
}

export function caseFoldedPath(value: string): string {
  return value.normalize("NFC").toLowerCase().normalize("NFC");
}

export function isSourcePath(value: string): boolean {
  return isSafeRelativePath(value) && value.startsWith("src/");
}

export async function loadSiteConfig(root: string): Promise<SiteConfig> {
  let packageJson: unknown;
  try {
    packageJson = JSON.parse(
      await readFile(resolve(root, "package.json"), "utf8"),
    );
  } catch {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      "package.json is invalid",
    );
  }
  const site = (packageJson as { convos?: { site?: unknown } }).convos?.site;
  if (
    typeof site !== "object" ||
    site === null ||
    Array.isArray(site) ||
    Object.keys(site).some(
      (key) =>
        ![
          "server",
          "client",
          "compatibilityDate",
          "compatibilityFlags",
        ].includes(key),
    )
  ) {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      "invalid convos.site configuration",
    );
  }
  const config = site as Partial<SiteConfig>;
  if (
    typeof config.server !== "string" ||
    !isSourcePath(config.server) ||
    typeof config.client !== "string" ||
    !isSourcePath(config.client) ||
    config.server === config.client
  ) {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      "invalid runtime entrypoints",
    );
  }
  if (!isValidCompatibilityDate(config.compatibilityDate)) {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      "invalid compatibility date",
    );
  }
  if (
    !Array.isArray(config.compatibilityFlags) ||
    !config.compatibilityFlags.every(
      (flag): flag is string =>
        typeof flag === "string" && ALLOWED_COMPATIBILITY_FLAGS.has(flag),
    ) ||
    !isStrictlySorted(config.compatibilityFlags)
  ) {
    throw new SiteError(
      "invalid_configuration",
      "configuration",
      "invalid compatibility flags",
    );
  }
  const complete = config as SiteConfig;
  for (const path of [complete.server, complete.client]) {
    const fullPath = resolve(root, path);
    let metadata;
    try {
      metadata = await lstat(fullPath);
    } catch {
      throw new SiteError(
        "invalid_configuration",
        "configuration",
        `missing ${path}`,
      );
    }
    if (
      !fullPath.startsWith(`${root}${sep}`) ||
      metadata.isSymbolicLink() ||
      !metadata.isFile()
    ) {
      throw new SiteError(
        "invalid_configuration",
        "configuration",
        `invalid runtime file ${path}`,
      );
    }
  }
  return complete;
}

function isStrictlySorted(values: readonly string[]): boolean {
  return values.every(
    (value, index) =>
      index === 0 || compareCodePoints(values[index - 1], value) < 0,
  );
}

function isValidCompatibilityDate(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    value < MIN_COMPATIBILITY_DATE ||
    value > MAX_COMPATIBILITY_DATE
  ) {
    return false;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}
