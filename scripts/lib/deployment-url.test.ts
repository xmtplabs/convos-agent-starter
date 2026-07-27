import assert from "node:assert/strict";
import test from "node:test";
import { credentialFreeHttpsUrl, poolUrl, runtimeGitUrl } from "./deployment-url.js";

test("accepts credential-free HTTPS deployment URLs", () => {
  assert.equal(
    credentialFreeHttpsUrl("https://git.example.com/sites/repository.git")?.href,
    "https://git.example.com/sites/repository.git",
  );
  assert.equal(
    poolUrl("https://pool.example.com/runtime/")?.href,
    "https://pool.example.com/runtime/",
  );
});

test("accepts only the trusted internal pool origin over HTTP", () => {
  assert.equal(
    poolUrl("http://runtime.internal")?.href,
    "http://runtime.internal/",
  );
});

test("rejects credentials from HTTPS deployment URLs", () => {
  assert.equal(
    credentialFreeHttpsUrl("https://token@git.example.com/repository"),
    undefined,
  );
  assert.equal(poolUrl("https://token@pool.example.com"), undefined);
});

test("rejects internal-pool lookalikes and unsafe URL components", () => {
  for (const value of [
    "http://runtime.internal.evil",
    "http://runtime.internal:8080",
    "http://token@runtime.internal",
    "http://runtime.internal/api",
    "http://runtime.internal?target=evil",
    "http://runtime.internal#fragment",
    "http://other.internal",
  ]) {
    assert.equal(poolUrl(value), undefined, value);
  }
});

test("accepts only the instance-bound runtime Git proxy URL", () => {
  assert.equal(
    runtimeGitUrl(
      "http://runtime.internal/api/internal/sites/git/agents-instance-123.git",
      "instance-123",
    )?.href,
    "http://runtime.internal/api/internal/sites/git/agents-instance-123.git",
  );
  for (const value of [
    "https://runtime.internal/api/internal/sites/git/agents-instance-123.git",
    "http://runtime.internal/api/internal/sites/git/other.git",
    "http://runtime.internal/api/internal/sites/git/agents-instance-123.git?proxy=evil",
    "http://runtime.internal./api/internal/sites/git/agents-instance-123.git",
  ]) {
    assert.equal(runtimeGitUrl(value, "instance-123"), undefined, value);
  }
});
