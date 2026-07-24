import { execFile } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import {
  MANIFEST_FILE,
  verifySiteManifest,
} from "./site-manifest.mjs";

const execFileAsync = promisify(execFile);
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const manifestBytes = await readFile(resolve(root, MANIFEST_FILE), "utf8");
const manifest = await verifySiteManifest(root, manifestBytes);
const modules = await Promise.all(
  manifest.modules.map(async (entry) => ({
    moduleName: entry.moduleName,
    type: entry.type,
    text: await readFile(resolve(root, entry.repoPath), "utf8"),
  })),
);
const assets = await Promise.all(
  manifest.assets.map(async (entry) => ({
    ...entry,
    base64: (await readFile(resolve(root, entry.repoPath))).toString("base64"),
  })),
);
const { stdout } = await execFileAsync("git", ["rev-parse", "HEAD"], {
  cwd: root,
});
const commitSha = stdout.trim();
if (!/^[a-f0-9]{40}$/.test(commitSha)) {
  throw new Error("platform preview requires a full SHA-1 HEAD");
}

const outputDirectory = resolve(root, ".preview");
await mkdir(outputDirectory, { recursive: true });
await writeFile(
  resolve(outputDirectory, "artifact.mjs"),
  `export default ${JSON.stringify({ manifest, modules, assets, commitSha })};\n`,
  "utf8",
);
