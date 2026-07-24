import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  MANIFEST_FILE,
  verifySiteManifest,
} from "./site-manifest.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestBytes = await readFile(resolve(root, MANIFEST_FILE), "utf8");
await verifySiteManifest(root, manifestBytes);
