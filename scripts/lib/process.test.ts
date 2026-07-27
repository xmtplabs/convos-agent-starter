import assert from "node:assert/strict";
import { type ChildProcess } from "node:child_process";
import { EventEmitter } from "node:events";
import {
  access,
  chmod,
  mkdir,
  mkdtemp,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PassThrough } from "node:stream";
import test from "node:test";

test("uses pinned system Git when hostile PATH exists before import", async () => {
  const root = await mkdtemp(join(tmpdir(), "convos-runner-path-"));
  const bin = join(root, "node_modules", ".bin");
  const marker = join(root, "fake-git-invoked");
  const originalPath = process.env.PATH;
  try {
    await mkdir(bin, { recursive: true });
    const fakeGit = join(bin, "git");
    await writeFile(
      fakeGit,
      `#!/bin/sh\nprintf invoked > ${JSON.stringify(marker)}\n`,
      "utf8",
    );
    await chmod(fakeGit, 0o755);
    process.env.PATH = `${bin}:/usr/bin:/bin`;

    const { createRunner } = await import("./process.js");
    const result = await createRunner(root)("git", ["--version"]);
    assert.match(result.stdout, /^git version /);
    await assert.rejects(access(marker));
  } finally {
    if (originalPath === undefined) delete process.env.PATH;
    else process.env.PATH = originalPath;
    await rm(root, { recursive: true, force: true });
  }
});

test("waits for close so output delivered after exit is not omitted", async () => {
  const { createRunner } = await import("./process.js");
  const child = new EventEmitter();
  const stdout = new PassThrough();
  const stderr = new PassThrough();
  Object.assign(child, { stdout, stderr });
  const run = createRunner(
    "/tmp",
    (() => child as unknown as ChildProcess) as typeof import("node:child_process").spawn,
  );

  const result = run("git", ["status"]);
  child.emit("exit", 0);
  stdout.write("complete status\\0");
  child.emit("close", 0);

  assert.equal((await result).stdout, "complete status\\0");
});

test("isolates Git push from authored environment, hooks, and ambient config", async () => {
  const { createRunner } = await import("./process.js");
  const originalPath = process.env.PATH;
  const originalProxy = process.env.HTTPS_PROXY;
  const originalConfigCount = process.env.GIT_CONFIG_COUNT;
  const child = new EventEmitter();
  Object.assign(child, { stdout: new PassThrough(), stderr: new PassThrough() });
  let invocation: { command: string; args: string[]; env?: NodeJS.ProcessEnv } | undefined;
  const run = createRunner(
    "/tmp",
    ((command, args, options) => {
      invocation = { command, args: args ? [...args] : [], env: options?.env };
      queueMicrotask(() => child.emit("close", 0));
      return child as unknown as ChildProcess;
    }) as typeof import("node:child_process").spawn,
  );
  try {
    process.env.PATH = "/site-authored/bin";
    process.env.HTTPS_PROXY = "https://site-authored.invalid";
    process.env.GIT_CONFIG_COUNT = "1";
    await run("git", ["push", "http://runtime.internal/repo", "HEAD:main"]);
    assert.equal(invocation?.command, "/usr/bin/git");
    assert.deepEqual(invocation?.args.slice(0, 4), [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "credential.helper=",
    ]);
    assert.equal(invocation?.env?.CODE_STORAGE_GIT_TOKEN, undefined);
    assert.equal(invocation?.env?.HTTPS_PROXY, undefined);
    assert.equal(invocation?.env?.GIT_CONFIG_COUNT, undefined);
    assert.equal(invocation?.env?.GIT_CONFIG_GLOBAL, "/dev/null");
    assert.equal(invocation?.env?.PATH, "/usr/bin:/bin");
  } finally {
    if (originalPath === undefined) delete process.env.PATH;
    else process.env.PATH = originalPath;
    if (originalProxy === undefined) delete process.env.HTTPS_PROXY;
    else process.env.HTTPS_PROXY = originalProxy;
    if (originalConfigCount === undefined) delete process.env.GIT_CONFIG_COUNT;
    else process.env.GIT_CONFIG_COUNT = originalConfigCount;
  }
});
