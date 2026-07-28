import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const { errorJson, SiteError } = await import("./lib/error.js");
const { credentialFreeHttpsUrl, poolUrl, runtimeGitUrl } = await import(
  "./lib/deployment-url.js"
);
const { validatedChangesStagingArgs } = await import("./lib/staging.js");
const { createRunner } = await import("./lib/process.js");
const { assertSafeLocalGitConfig } = await import("./lib/git-config.js");

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const run = createRunner(root);

const output = async (command: string, args: string[]) =>
  (await run(command, args)).stdout.trim();

async function loadAuthoredModules() {
  const initialBranch = await output("git", [
    "branch",
    "--show-current",
  ]);
  if (!initialBranch) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment requires a checked-out branch",
    );
  }
  if (initialBranch === "07-23-agent-sites") {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment from the preserved 07-23-agent-sites branch is forbidden",
    );
  }
  return Promise.all([
    import("./lib/manifest.js"),
    import("./lib/prompt.js"),
    import("./lib/render.js"),
  ]);
}

let authoredModules: Awaited<ReturnType<typeof loadAuthoredModules>>;
try {
  authoredModules = await loadAuthoredModules();
} catch (error) {
  process.stderr.write(errorJson(error));
  process.exit(1);
}
const [
  { createManifest, serializeManifest },
  { createOpenUiSystemPrompt },
  { renderFixturePage },
] = authoredModules;

const { serializeOpenUiCatalog } = await import("../src/catalog.js");

async function regenerate() {
  await writeFile(
    resolve(root, "generated/openui-catalog.json"),
    serializeOpenUiCatalog(),
    "utf8",
  );
  await writeFile(
    resolve(root, "generated/openui-system-prompt.txt"),
    createOpenUiSystemPrompt(),
    "utf8",
  );
  await writeFile(
    resolve(root, "convos.site.json"),
    serializeManifest(await createManifest(root)),
    "utf8",
  );
}

async function checkGenerated() {
  const [catalog, prompt, manifest] = await Promise.all([
    readFile(resolve(root, "generated/openui-catalog.json"), "utf8"),
    readFile(
      resolve(root, "generated/openui-system-prompt.txt"),
      "utf8",
    ),
    readFile(resolve(root, "convos.site.json"), "utf8"),
  ]);
  if (
    catalog !== serializeOpenUiCatalog() ||
    prompt !== createOpenUiSystemPrompt() ||
    manifest !== serializeManifest(await createManifest(root))
  ) {
    throw new SiteError(
      "invalid_manifest",
      "manifest",
      "generated catalog, prompt, or manifest is stale",
    );
  }
}

async function validate() {
  try {
    await run(
      process.execPath,
      [
        resolve(root, "node_modules/typescript/bin/tsc"),
        "--project",
        "tsconfig.json",
      ],
      { inherit: true },
    );
  } catch {
    throw new SiteError(
      "typecheck_failed",
      "typecheck",
      "TypeScript validation failed",
    );
  }
  const manifest = await createManifest(root);
  for (const page of manifest.assets.filter((entry) =>
    entry.path.startsWith("pages/"),
  )) {
    await renderFixturePage(root, page.path, "defaults");
  }
  const homepage = await renderFixturePage(root, "/", "live");
  if (!homepage.html.trim()) {
    throw new SiteError(
      "render_failed",
      "render",
      "homepage rendered no HTML",
    );
  }
}

const allowed = new Set([
  ".gitignore",
  "AGENTS.md",
  "convos.site.json",
  "package.json",
  "pnpm-lock.yaml",
  "tsconfig.json",
]);
function allowedPath(path: string) {
  return (
    allowed.has(path) ||
    [
      "assets/",
      "generated/",
      "pages/",
      "scripts/",
      "skills/",
      "src/",
    ].some((prefix) => path.startsWith(prefix))
  );
}

async function assertSafeChanges() {
  const status = (
    await run("git", [
      "status",
      "--porcelain=v1",
      "-z",
      "--untracked-files=all",
    ])
  ).stdout;
  const records = status.split("\0");
  if (records.at(-1) !== "") {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "Git status returned malformed porcelain output",
    );
  }
  records.pop();
  for (let index = 0; index < records.length; index += 1) {
    const record = records[index];
    if (
      record.length < 4 ||
      record[2] !== " " ||
      !/^[ MADRCUT?!]{2}$/.test(record.slice(0, 2)) ||
      record[0] === "!" ||
      record[1] === "!"
    ) {
      throw new SiteError(
        "deployment_failed",
        "deployment",
        "Git status returned unsupported porcelain output",
      );
    }
    const paths = [record.slice(3)];
    if (
      record[0] === "R" ||
      record[0] === "C" ||
      record[1] === "R" ||
      record[1] === "C"
    ) {
      const source = records[++index];
      if (!source) {
        throw new SiteError(
          "deployment_failed",
          "deployment",
          "Git status omitted a rename or copy source",
        );
      }
      paths.push(source);
    }
    for (const path of paths) {
      if (allowedPath(path)) continue;
      throw new SiteError(
        "deployment_failed",
        "deployment",
        "unexpected workspace change",
        { path },
      );
    }
  }
}

async function assertSafeGitConfiguration() {
  const configuredNames = await output("git", [
    "config",
    "--no-includes",
    "--local",
    "--name-only",
    "--null",
    "--list",
  ]);
  assertSafeLocalGitConfig(configuredNames);
}

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      `missing ${name}`,
    );
  }
  return value;
}

function requiredHttpsUrl(name: string, value: string): URL {
  const parsed = credentialFreeHttpsUrl(value);
  if (!parsed) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      `${name} must be a credential-free HTTPS URL`,
    );
  }
  return parsed;
}

function requiredPoolUrl(value: string): URL {
  const parsed = poolUrl(value);
  if (!parsed) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "POOL_URL must be a credential-free HTTPS URL or http://runtime.internal",
    );
  }
  return parsed;
}

function confirmsDeployment(result: unknown, commitSha: string): boolean {
  if (!result || typeof result !== "object") return false;
  const value = result as {
    ok?: unknown;
    commit_sha?: unknown;
    validation?: {
      checks?: unknown;
      duration_ms?: unknown;
    };
  };
  return (
    value.ok === true &&
    value.commit_sha === commitSha &&
    Number.isInteger(value.validation?.checks) &&
    Number(value.validation?.checks) >= 1 &&
    Number.isInteger(value.validation?.duration_ms) &&
    Number(value.validation?.duration_ms) >= 0
  );
}

async function commitPushAndActivate() {
  const poolBaseUrl = requiredPoolUrl(required("POOL_URL"));
  const publicBaseUrl = requiredHttpsUrl(
    "PUBLIC_BASE_URL",
    required("PUBLIC_BASE_URL"),
  );
  const instanceId = required("INSTANCE_ID");
  const gitUrl = runtimeGitUrl(
    required("CODE_STORAGE_GIT_URL"),
    instanceId,
  );
  if (!gitUrl) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "CODE_STORAGE_GIT_URL must be this instance's runtime Git proxy URL",
    );
  }

  await assertSafeGitConfiguration();
  await assertSafeChanges();
  await run("git", validatedChangesStagingArgs);
  const staged = await run(
    "git",
    ["diff", "--cached", "--quiet"],
    { allowExitCodes: [0, 1] },
  );
  if (staged.code === 1) {
    await run(
      "git",
      ["commit", "-m", "Publish OpenUI site artifacts"],
      { inherit: true },
    );
  }

  const branch = await output("git", ["branch", "--show-current"]);
  if (!branch) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment requires a checked-out branch",
    );
  }
  if (branch === "07-23-agent-sites") {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment from the preserved 07-23-agent-sites branch is forbidden",
    );
  }
  await run("git", ["check-ref-format", "--branch", branch]);

  const commitSha = await output("git", ["rev-parse", "HEAD"]);
  if (!/^[a-f0-9]{40}$/.test(commitSha)) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "invalid commit SHA",
    );
  }
  await run(
    "git",
    [
      "-c",
      "credential.helper=",
      "push",
      gitUrl.href,
      `${commitSha}:refs/heads/${branch}`,
    ],
    { inherit: true },
  );

  const response = await fetch(
    new URL("/api/internal/sites/deployment", poolBaseUrl),
    {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ commit_sha: commitSha }),
      redirect: "manual",
    },
  );
  let result: unknown;
  try {
    result = await response.json();
  } catch {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment API returned invalid JSON",
    );
  }
  if (
    !response.ok ||
    !confirmsDeployment(result, commitSha)
  ) {
    throw new SiteError(
      "deployment_failed",
      "deployment",
      "deployment activation was not confirmed",
    );
  }

  const pathname = `${publicBaseUrl.pathname.replace(
    /\/$/,
    "",
  )}/sites/${encodeURIComponent(instanceId)}/`;
  publicBaseUrl.pathname = pathname;
  publicBaseUrl.search = "";
  publicBaseUrl.hash = "";
  process.stdout.write(`${publicBaseUrl.href}\n`);
}

try {
  await regenerate();
  await checkGenerated();
  await validate();
  await commitPushAndActivate();
} catch (error) {
  process.stderr.write(errorJson(error));
  process.exitCode = 1;
}
