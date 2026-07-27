import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import test from "node:test";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test(
  "Linux retains a startup secret in /proc after process.env deletion",
  { skip: process.platform !== "linux" },
  async () => {
    const token = "credential-boundary-regression-token";
    const { stdout } = await execFileAsync(
      process.execPath,
      [
        "-e",
        `const { readFileSync } = require('node:fs'); delete process.env.CODE_STORAGE_GIT_TOKEN; process.stdout.write(readFileSync('/proc/self/environ').includes('${token}') ? 'retained' : 'cleared');`,
      ],
      {
        env: { ...process.env, CODE_STORAGE_GIT_TOKEN: token },
      },
    );
    assert.equal(stdout, "retained");
  },
);
