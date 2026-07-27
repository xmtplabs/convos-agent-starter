import assert from "node:assert/strict";
import test from "node:test";
import { assertSafeLocalGitConfig } from "./git-config.js";

test("rejects local Git settings that can execute code or rewrite deployment transport", () => {
  for (const name of [
    "core.hooksPath",
    "core.fsmonitor",
    "filter.site.clean",
    "url.https://attacker.invalid/.insteadOf",
    "http.proxy",
    "http.sslVerify",
    "credential.helper",
    "remote.origin.proxy",
    "include.path",
  ]) {
    assert.throws(() => assertSafeLocalGitConfig(`${name}\0`));
  }
});

test("allows ordinary repository metadata without contacting a remote", () => {
  assert.doesNotThrow(() =>
    assertSafeLocalGitConfig(
      "core.repositoryformatversion\0remote.origin.url\0branch.main.merge\0",
    ),
  );
});
