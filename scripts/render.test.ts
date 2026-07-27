import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { WORKSPACE_VALUE_MAX_BYTES } from "./lib/manifest.js";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

async function render(target: string) {
  return await new Promise<{ code: number | null; stderr: string; stdout: string }>(
    (resolveResult, reject) => {
      const child = spawn("pnpm", ["--silent", "render", "--", target], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.once("error", reject);
      child.once("close", (code) => {
        resolveResult({ code, stderr, stdout });
      });
    },
  );
}

async function deploy() {
  return await new Promise<{ code: number | null; stderr: string; stdout: string }>(
    (resolveResult, reject) => {
      const child = spawn("pnpm", ["--silent", "run", "deploy"], {
        cwd: root,
        stdio: ["ignore", "pipe", "pipe"],
      });
      let stdout = "";
      let stderr = "";
      child.stdout.on("data", (chunk) => {
        stdout += chunk;
      });
      child.stderr.on("data", (chunk) => {
        stderr += chunk;
      });
      child.once("error", reject);
      child.once("close", (code) => {
        resolveResult({ code, stderr, stdout });
      });
    },
  );
}

test("render command reserves stdout for complete HTML", async () => {
  const result = await render("/");

  assert.equal(result.code, 0);
  assert.match(result.stdout, /^<!doctype html>/);
  assert.equal(result.stderr, "");
});

test("render command sends invalid-route errors only to stderr", async () => {
  const result = await render("/missing");

  assert.equal(result.code, 1);
  assert.equal(result.stdout, "");
  assert.equal(result.stderr, '{"code":"invalid_page","phase":"page"}\n');
});

test("render command rejects a source file above the platform workspace limit", async () => {
  const oversized = resolve(root, "src/workspace-limit-test.ts");
  try {
    await writeFile(oversized, "x".repeat(WORKSPACE_VALUE_MAX_BYTES + 1));
    const result = await render("/");
    assert.equal(result.code, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, '{"code":"invalid_manifest","phase":"manifest"}\n');
  } finally {
    await rm(oversized, { force: true });
  }
});

test("deploy command rejects a source file above the platform workspace limit", async () => {
  const oversized = resolve(root, "src/workspace-limit-test.ts");
  try {
    await writeFile(oversized, "x".repeat(WORKSPACE_VALUE_MAX_BYTES + 1));
    const result = await deploy();
    assert.equal(result.code, 1);
    assert.equal(result.stdout, "");
    assert.equal(result.stderr, '{"code":"invalid_manifest","phase":"manifest"}\n');
  } finally {
    await rm(oversized, { force: true });
  }
});
