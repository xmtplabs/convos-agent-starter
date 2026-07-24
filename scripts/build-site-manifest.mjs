import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  createSiteManifest,
  MANIFEST_FILE,
  serializeSiteManifest,
  verifySiteManifest,
} from "./site-manifest.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = resolve(root, MANIFEST_FILE);
const first = serializeSiteManifest(await createSiteManifest(root));
await writeFile(manifestPath, first, "utf8");

const reopened = await readFile(manifestPath, "utf8");
await verifySiteManifest(root, reopened);
const second = serializeSiteManifest(await createSiteManifest(root));
if (reopened !== first || second !== first) {
  throw new Error("artifact manifest generation is not deterministic");
}
