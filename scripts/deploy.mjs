import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const gitUrl = requiredEnvironment("CODE_STORAGE_GIT_URL");
const gitToken = requiredEnvironment("CODE_STORAGE_GIT_TOKEN");
const poolUrl = requiredUrl("POOL_URL");
const publicBaseUrl = requiredUrl("PUBLIC_BASE_URL");
const instanceId = requiredEnvironment("INSTANCE_ID");

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

function requiredEnvironment(name) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`set ${name} before deploying`);
  return value;
}

function requiredUrl(name) {
  const value = requiredEnvironment(name);
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
    return url;
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
}

function redact(value) {
  return value.replaceAll(gitToken, "[redacted]");
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

await run("pnpm", ["build"], { inherit: true });
await run("node", ["scripts/validate-artifacts.mjs"], { inherit: true });
await run("git", ["add", "-A"]);

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
  await run("git", [
    ...identityArgs,
    "commit",
    "-m",
    "Publish agent site artifacts",
  ]);
}

const branch = await output("git", ["branch", "--show-current"]);
if (!branch) throw new Error("deployment requires a checked-out branch");
await run("git", ["check-ref-format", "--branch", branch]);

// The helper reads the credential from the process environment when Git invokes
// it. The token is never placed in argv, a remote URL, or repository config.
const credentialHelper =
  '!f() { if [ "$1" = get ]; then printf "username=t\\npassword=%s\\n" "$CODE_STORAGE_GIT_TOKEN"; fi; }; f';
await run("git", [
  "-c",
  "credential.helper=",
  "-c",
  `credential.helper=${credentialHelper}`,
  "push",
  gitUrl,
  `HEAD:refs/heads/${branch}`,
], { includeGitCredential: true });

const commitSha = await output("git", ["rev-parse", "HEAD"]);
if (!/^[a-f0-9]{40}$/.test(commitSha)) {
  throw new Error("could not resolve a full SHA-1 commit after push");
}

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

const siteUrl = new URL(
  `/sites/${encodeURIComponent(instanceId)}/`,
  publicBaseUrl,
);
console.log(siteUrl.href);
