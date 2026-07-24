import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { performance } from "node:perf_hooks";
import { fileURLToPath } from "node:url";
import {
  buildPinnedSiteUrl,
  requiredEnvironment,
  requiredUrl,
} from "./site-location.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const gitUrl = requiredEnvironment("CODE_STORAGE_GIT_URL");
const gitToken = requiredEnvironment("CODE_STORAGE_GIT_TOKEN");
const poolUrl = requiredUrl("POOL_URL");
const publicBaseUrl = requiredUrl("PUBLIC_BASE_URL");
const instanceId = requiredEnvironment("INSTANCE_ID");
const deploymentStartedAt = performance.now();

const parsedGitUrl = new URL(gitUrl);
if (
  parsedGitUrl.protocol !== "https:" ||
  parsedGitUrl.username !== "" ||
  parsedGitUrl.password !== ""
) {
  throw new Error(
    "CODE_STORAGE_GIT_URL must be an HTTPS URL without embedded credentials",
  );
}

function redact(value) {
  return value.replaceAll(gitToken, "[redacted]");
}

function elapsedSeconds(startedAt) {
  return ((performance.now() - startedAt) / 1000).toFixed(2);
}

async function timed(label, operation) {
  const startedAt = performance.now();
  try {
    const value = await operation();
    console.error(`[deploy] ${label}: ${elapsedSeconds(startedAt)}s`);
    return value;
  } catch (error) {
    console.error(
      `[deploy] ${label}: failed after ${elapsedSeconds(startedAt)}s`,
    );
    throw error;
  }
}

function run(
  command,
  args,
  {
    allowExitCodes = [0],
    inherit = false,
    includeGitCredential = false,
  } = {},
) {
  return new Promise((resolvePromise, reject) => {
    let stdout = "";
    let stderr = "";
    const childEnvironment = {
      ...process.env,
      GIT_TERMINAL_PROMPT: "0",
    };
    if (!includeGitCredential) {
      delete childEnvironment.CODE_STORAGE_GIT_TOKEN;
    }
    const child = spawn(command, args, {
      cwd: root,
      env: childEnvironment,
      shell: false,
      stdio: inherit ? "inherit" : ["ignore", "pipe", "pipe"],
    });
    if (!inherit) {
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
    }
    child.on("error", reject);
    child.on("exit", (code) => {
      if (code !== null && allowExitCodes.includes(code)) {
        resolvePromise({ code, stdout: stdout.trim(), stderr: stderr.trim() });
        return;
      }
      reject(
        new Error(
          redact(
            `${command} ${args.slice(0, 3).join(" ")} failed (${code}): ${stderr || stdout}`,
          ),
        ),
      );
    });
  });
}

async function output(command, args) {
  return (await run(command, args)).stdout;
}

await timed("build and validate artifacts", () =>
  run("pnpm", ["build"], { inherit: true }),
);
await timed("stage workspace", () => run("git", ["add", "-A"]));

const staged = await run("git", ["diff", "--cached", "--quiet"], {
  allowExitCodes: [0, 1],
});
if (staged.code === 1) {
  const name = await run("git", ["config", "--get", "user.name"], {
    allowExitCodes: [0, 1],
  });
  const email = await run("git", ["config", "--get", "user.email"], {
    allowExitCodes: [0, 1],
  });
  const identityArgs = [];
  if (name.code === 1 || name.stdout === "") {
    identityArgs.push("-c", "user.name=Convos Site Bot");
  }
  if (email.code === 1 || email.stdout === "") {
    identityArgs.push("-c", "user.email=site-bot@convos.org");
  }
  await timed("create deployment commit", () =>
    run("git", [
      ...identityArgs,
      "commit",
      "-m",
      "Publish agent site artifacts",
    ]),
  );
} else {
  console.error("[deploy] create deployment commit: skipped (no changes)");
}

const branch = await output("git", ["branch", "--show-current"]);
if (!branch) throw new Error("deployment requires a checked-out branch");
await run("git", ["check-ref-format", "--branch", branch]);

// The helper reads the credential from the process environment when Git invokes
// it. The token is never placed in argv, a remote URL, or repository config.
const credentialHelper =
  '!f() { if [ "$1" = get ]; then printf "username=t\\npassword=%s\\n" "$CODE_STORAGE_GIT_TOKEN"; fi; }; f';
await timed("push deployment commit", () =>
  run(
    "git",
    [
      "-c",
      "credential.helper=",
      "-c",
      `credential.helper=${credentialHelper}`,
      "push",
      gitUrl,
      `HEAD:refs/heads/${branch}`,
    ],
    { includeGitCredential: true },
  ),
);

const commitSha = await output("git", ["rev-parse", "HEAD"]);
if (!/^[a-f0-9]{40}$/.test(commitSha)) {
  throw new Error("could not resolve a full SHA-1 commit after push");
}

const result = await timed(
  "materialize, validate, and activate",
  async () => {
    const response = await fetch(
      new URL("/api/internal/site/deployment", poolUrl),
      {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ commit_sha: commitSha }),
        redirect: "manual",
      },
    );
    const responseText = await response.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      throw new Error(
        `runtime deployment returned non-JSON (${response.status}): ${responseText.slice(0, 1000)}`,
      );
    }
    if (!response.ok) {
      throw new Error(
        `runtime deployment failed (${response.status}): ${JSON.stringify(result).slice(0, 1000)}`,
      );
    }
    if (
      result?.ok !== true ||
      result.commit_sha !== commitSha ||
      result.active_commit_sha !== commitSha ||
      result.validation?.status !== 200
    ) {
      throw new Error(
        "runtime deployment response did not confirm activation of the pushed commit",
      );
    }
    return result;
  },
);

const reusedArtifact =
  typeof result.reused_artifact === "boolean"
    ? String(result.reused_artifact)
    : "unknown";
const downloadedFiles = Number.isSafeInteger(result.downloaded_files)
  ? result.downloaded_files
  : "unknown";
const uploadedBlobs = Number.isSafeInteger(result.uploaded_blobs)
  ? result.uploaded_blobs
  : "unknown";
const validationMs = Number.isSafeInteger(result.validation.duration_ms)
  ? result.validation.duration_ms
  : "unknown";
console.error(
  `[deploy] activation details: reused_artifact=${reusedArtifact} downloaded_files=${downloadedFiles} uploaded_blobs=${uploadedBlobs} validation_ms=${validationMs}`,
);
console.error(`[deploy] total: ${elapsedSeconds(deploymentStartedAt)}s`);

const siteUrl = buildPinnedSiteUrl(publicBaseUrl, instanceId);
console.log(siteUrl.href);
