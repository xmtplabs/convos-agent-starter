import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { promisify } from "node:util";
import { validatedChangesStagingArgs } from "./staging.js";

const execFileAsync = promisify(execFile);

async function git(root: string, args: string[]) {
  return execFileAsync("git", args, { cwd: root });
}

test("stages deletions and allowed untracked paths without an assets directory", async () => {
  const root = await mkdtemp(join(tmpdir(), "convos-staging-"));
  try {
    await git(root, ["init"]);
    await git(root, ["config", "user.email", "test@example.com"]);
    await git(root, ["config", "user.name", "Test"]);
    await writeFile(join(root, "removed.txt"), "remove me\n");
    await git(root, ["add", "removed.txt"]);
    await git(root, ["commit", "-m", "initial"]);

    await rm(join(root, "removed.txt"));
    await writeFile(join(root, "new.txt"), "stage me\n");
    await git(root, validatedChangesStagingArgs);

    const { stdout } = await git(root, ["diff", "--cached", "--name-status"]);
    assert.equal(stdout, "A\tnew.txt\nD\tremoved.txt\n");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
