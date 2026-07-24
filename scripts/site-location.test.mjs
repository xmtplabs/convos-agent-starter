import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPinnedSiteUrl,
  requiredEnvironment,
  requiredUrl,
} from "./site-location.mjs";

test("buildPinnedSiteUrl creates the stable mounted URL", () => {
  assert.equal(
    buildPinnedSiteUrl(
      new URL("https://dev.convos.fun/ignored"),
      "assistant/one",
    ).href,
    "https://dev.convos.fun/sites/assistant%2Fone/",
  );
});

test("runtime site location values are trimmed and validated", () => {
  const environment = {
    INSTANCE_ID: " assistant-one ",
    PUBLIC_BASE_URL: " https://dev.convos.fun ",
  };
  assert.equal(
    requiredEnvironment("INSTANCE_ID", environment),
    "assistant-one",
  );
  assert.equal(
    requiredUrl("PUBLIC_BASE_URL", environment).href,
    "https://dev.convos.fun/",
  );
  assert.throws(
    () => requiredUrl("PUBLIC_BASE_URL", { PUBLIC_BASE_URL: "ftp://host" }),
    /must be an absolute URL/,
  );
  assert.throws(
    () => requiredEnvironment("INSTANCE_ID", { INSTANCE_ID: " " }),
    /set INSTANCE_ID in the runtime environment/,
  );
});
