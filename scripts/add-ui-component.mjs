import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { readFile, readdir, stat, writeFile } from "node:fs/promises";
import { dirname, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const component = process.argv[2];
if (!component || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(component)) {
  throw new Error("usage: pnpm ui:add -- <lowercase-component-name>");
}
if (process.argv.length !== 3) {
  throw new Error("ui:add accepts exactly one component name");
}

function run(command, args, { capture = false } = {}) {
  return new Promise((resolvePromise, reject) => {
    let output = "";
    const child = spawn(command, args, {
      cwd: root,
      env: {
        ...process.env,
        npm_config_save_exact: "true",
        PNPM_CONFIG_SAVE_EXACT: "true",
      },
      shell: false,
      stdio: capture ? ["ignore", "pipe", "inherit"] : "inherit",
    });
    if (capture) {
      child.stdout.on("data", (chunk) => {
        output += chunk;
      });
    }
    child.on("error", reject);
    child.on("exit", (code) =>
      code === 0
        ? resolvePromise(output.trim())
        : reject(new Error(`${command} exited with ${code}`)),
    );
  });
}

const ignoredDirectories = new Set([
  ".git",
  ".preview",
  ".wrangler",
  "dist",
  "node_modules",
  "public",
]);
const slashPath = (value) =>
  sep === "/" ? value : value.split(sep).join("/");

async function snapshot(directory = root) {
  const files = new Map();
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      for (const [name, hash] of await snapshot(path)) files.set(name, hash);
      continue;
    }
    if (!entry.isFile()) continue;
    const bytes = await readFile(path);
    files.set(
      slashPath(relative(root, path)),
      createHash("sha256").update(bytes).digest("hex"),
    );
  }
  return files;
}

const before = await snapshot();
await run("pnpm", ["exec", "shadcn", "add", component]);

const config = JSON.parse(
  await readFile(resolve(root, "components.json"), "utf8"),
);
const expectedAliases = {
  components: "@/components",
  hooks: "@/hooks",
  lib: "@/lib",
  ui: "@/components/ui",
  utils: "@/lib/utils",
};
if (
  config.style !== "new-york" ||
  config.rsc !== false ||
  config.tsx !== true ||
  config.iconLibrary !== "lucide" ||
  config.tailwind?.config !== "" ||
  config.tailwind?.css !== "src/styles/globals.css" ||
  config.tailwind?.baseColor !== "neutral" ||
  config.tailwind?.cssVariables !== true ||
  config.tailwind?.prefix !== "" ||
  Object.entries(expectedAliases).some(
    ([key, value]) => config.aliases?.[key] !== value,
  )
) {
  throw new Error("components.json no longer matches the starter aliases");
}

const after = await snapshot();
const allowedSourceRoots = ["src/components/", "src/hooks/", "src/lib/"];
const allowedExactPaths = new Set([
  "package.json",
  "pnpm-lock.yaml",
  config.tailwind.css,
]);
const isAllowedPath = (path) =>
  allowedExactPaths.has(path) ||
  allowedSourceRoots.some((prefix) => path.startsWith(prefix));
for (const [path, hash] of after) {
  if (before.get(path) === hash) continue;
  if (!isAllowedPath(path)) {
    throw new Error(`shadcn changed a file outside configured aliases: ${path}`);
  }
}
for (const path of before.keys()) {
  if (!after.has(path) && !isAllowedPath(path)) {
    throw new Error(`shadcn deleted a file outside configured aliases: ${path}`);
  }
}

const packagePath = resolve(root, "package.json");
const packageJson = JSON.parse(await readFile(packagePath, "utf8"));
const dependencyFields = [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "peerDependencies",
];
const exactVersion = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;
const hasRanges = dependencyFields.some((field) =>
  Object.values(packageJson[field] ?? {}).some(
    (version) => !exactVersion.test(version),
  ),
);
if (hasRanges) {
  const listed = JSON.parse(
    await run("pnpm", ["list", "--depth", "-1", "--json"], {
      capture: true,
    }),
  )[0];
  for (const field of dependencyFields) {
    for (const [name, declared] of Object.entries(packageJson[field] ?? {})) {
      if (exactVersion.test(declared)) continue;
      const installed =
        listed.dependencies?.[name]?.version ??
        listed.devDependencies?.[name]?.version ??
        listed.optionalDependencies?.[name]?.version;
      if (!installed || !exactVersion.test(installed)) {
        throw new Error(`could not exact-pin ${name} from the installed graph`);
      }
      packageJson[field][name] = installed;
    }
  }
  await writeFile(
    packagePath,
    `${JSON.stringify(packageJson, null, 2)}\n`,
    "utf8",
  );
  await run("pnpm", ["install", "--lockfile-only"]);
}

const finalPackage = JSON.parse(await readFile(packagePath, "utf8"));
for (const field of dependencyFields) {
  for (const [name, version] of Object.entries(finalPackage[field] ?? {})) {
    if (!exactVersion.test(version)) {
      throw new Error(`${field}.${name} is not exact-pinned: ${version}`);
    }
  }
}

const componentPath = resolve(
  root,
  config.aliases.ui.replace(/^@\//, "src/"),
  `${component}.tsx`,
);
if (!(await stat(componentPath)).isFile()) {
  throw new Error(`shadcn did not generate ${relative(root, componentPath)}`);
}
