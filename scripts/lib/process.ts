import { spawn, type ChildProcess } from "node:child_process";
import { isAbsolute } from "node:path";
import { SiteError } from "./error.js";

export type RunOptions = {
  allowExitCodes?: number[];
  inherit?: boolean;
};

type SpawnProcess = typeof spawn;

const TRUSTED_GIT_PATH = "/usr/bin/git";
const TRUSTED_PATH = "/usr/bin:/bin";
const safeGitArguments = [
  "-c",
  "core.hooksPath=/dev/null",
  "-c",
  "credential.helper=",
];

function childEnvironment(): NodeJS.ProcessEnv {
  const environment: NodeJS.ProcessEnv = {
    PATH: TRUSTED_PATH,
    GIT_TERMINAL_PROMPT: "0",
    GIT_CONFIG_NOSYSTEM: "1",
    GIT_CONFIG_SYSTEM: "/dev/null",
    GIT_CONFIG_GLOBAL: "/dev/null",
    GIT_ATTR_NOSYSTEM: "1",
  };
  return environment;
}

function trustedCommand(command: string): string {
  if (command === "git") return TRUSTED_GIT_PATH;
  if (isAbsolute(command)) return command;
  throw new SiteError(
    "deployment_failed",
    "deployment",
    "deployment commands must use a trusted absolute executable",
  );
}

export function createRunner(root: string, spawnProcess: SpawnProcess = spawn) {
  return (
    command: string,
    args: string[],
    options: RunOptions = {},
  ) =>
    new Promise<{ code: number; stdout: string; stderr: string }>(
      (resolvePromise, reject) => {
        let settled = false;
        const rejectOnce = (error: unknown) => {
          if (settled) return;
          settled = true;
          reject(error);
        };
        const resolveOnce = (result: {
          code: number;
          stdout: string;
          stderr: string;
        }) => {
          if (settled) return;
          settled = true;
          resolvePromise(result);
        };
        let child: ChildProcess;
        try {
          child = spawnProcess(
            trustedCommand(command),
            command === "git" ? [...safeGitArguments, ...args] : args,
            {
            cwd: root,
            env: childEnvironment(),
            stdio: options.inherit
              ? "inherit"
              : ["ignore", "pipe", "pipe"],
            },
          );
        } catch (error) {
          rejectOnce(error);
          return;
        }
        let stdout = "";
        let stderr = "";
        if (!options.inherit) {
          child.stdout?.on("data", (chunk) => {
            stdout += chunk;
          });
          child.stderr?.on("data", (chunk) => {
            stderr += chunk;
          });
        }
        child.on("error", rejectOnce);
        child.on("close", (code) => {
          const exitCode = code ?? -1;
          if ((options.allowExitCodes ?? [0]).includes(exitCode)) {
            resolveOnce({ code: exitCode, stdout, stderr });
            return;
          }
          rejectOnce(
            new SiteError(
              "deployment_failed",
              "deployment",
              `${command} failed`,
              { exit_code: exitCode },
            ),
          );
        });
      },
    );
}
