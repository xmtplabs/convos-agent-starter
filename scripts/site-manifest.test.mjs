import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { resolve } from "node:path";
import test from "node:test";
import {
  createSiteManifest,
  serializeSiteManifest,
  verifySiteManifest,
} from "./site-manifest.mjs";

async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), "convos-site-manifest-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(resolve(root, "dist/server"), { recursive: true });
  await mkdir(resolve(root, "public/assets"), { recursive: true });
  await writeFile(
    resolve(root, "dist/server/index.js"),
    "export default { fetch() { return new Response('ok') } };\n",
  );
  await writeFile(resolve(root, "public/assets/app.css"), "body{}\n");
  return root;
}

test("manifest generation is byte-for-byte deterministic", async (t) => {
  const root = await fixture(t);
  const first = serializeSiteManifest(await createSiteManifest(root));
  const second = serializeSiteManifest(await createSiteManifest(root));
  assert.equal(second, first);
  const parsed = await verifySiteManifest(root, first);
  assert.match(parsed.artifactDigest, /^[a-f0-9]{64}$/);
  assert.equal(parsed.modules[0].type, "js");
  assert.equal(parsed.assets[0].contentType, "text/css; charset=utf-8");
});

test("verification rejects an undeclared output file", async (t) => {
  const root = await fixture(t);
  const bytes = serializeSiteManifest(await createSiteManifest(root));
  await writeFile(resolve(root, "public/extra.txt"), "stale\n");
  await assert.rejects(
    verifySiteManifest(root, bytes),
    /does not exactly match/,
  );
});
