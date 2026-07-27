import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import {
  createManifest,
  WORKSPACE_VALUE_MAX_BYTES,
} from "./manifest.js";
import { canonicalJson, compareCodePoints } from "./canonical.js";

const integrity = `sha512-${"A".repeat(86)}==`;

function lockfile(snapshotBody: string, lockedIntegrity = integrity): string {
  return `lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

overrides:
  '@modelcontextprotocol/sdk': '-'

importers:
  .:
    dependencies:
      root:
        specifier: 1.0.0
        version: 1.0.0

packages:
  root@1.0.0:
    resolution: {integrity: ${lockedIntegrity}}
  optional@1.0.0:
    resolution: {integrity: ${lockedIntegrity}}

snapshots:
${snapshotBody}`;
}

async function withFixture<T>(
  snapshotBody: string,
  callback: (root: string) => Promise<T>,
  lockedIntegrity = integrity,
): Promise<T> {
  const root = await mkdtemp(join(tmpdir(), "convos-manifest-"));
  try {
    await mkdir(join(root, "src"));
    await mkdir(join(root, "pages"));
    await mkdir(join(root, "generated"));
    await Promise.all([
      writeFile(
        join(root, "package.json"),
        JSON.stringify({
          dependencies: { root: "1.0.0" },
          convos: {
            site: {
              server: "src/server.ts",
              client: "src/client.ts",
              styles: ["src/styles.css"],
              compatibilityDate: "2026-07-24",
              compatibilityFlags: [],
            },
          },
        }),
      ),
      writeFile(
        join(root, "pnpm-lock.yaml"),
        lockfile(snapshotBody, lockedIntegrity),
      ),
      writeFile(join(root, "src/server.ts"), "export default {}"),
      writeFile(join(root, "src/client.ts"), "export {}"),
      writeFile(join(root, "src/styles.css"), ""),
      writeFile(join(root, "pages/index.openui"), "Page(\"Home\", [])"),
      writeFile(join(root, "generated/openui-system-prompt.txt"), "prompt"),
      writeFile(join(root, "generated/openui-catalog.json"), "{}"),
    ]);
    return await callback(root);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}


test("includes optional snapshot targets in the locked production graph", async () => {
  const manifest = await withFixture(
    `  root@1.0.0:
    optionalDependencies:
      optional: 1.0.0
  optional@1.0.0: {}
`,
    createManifest,
  );
  assert.deepEqual(manifest.dependencies.packages, [
    {
      name: "optional",
      version: "1.0.0",
      integrity,
      dependencies: {},
    },
    {
      name: "root",
      version: "1.0.0",
      integrity,
      dependencies: { optional: "1.0.0" },
    },
  ]);
});

test("rejects overlapping or duplicate snapshot dependency names", async () => {
  await assert.rejects(
    withFixture(
      `  root@1.0.0:
    dependencies:
      optional: 1.0.0
    optionalDependencies:
      optional: 1.0.0
  optional@1.0.0: {}
`,
      createManifest,
    ),
  );
  await assert.rejects(
    withFixture(
      `  root@1.0.0:
    optionalDependencies:
      optional: 1.0.0
      optional: 1.0.0
  optional@1.0.0: {}
`,
      createManifest,
    ),
  );
});

test("terminates a cyclic production snapshot graph", async () => {
  const manifest = await withFixture(
    `  root@1.0.0:
    dependencies:
      root: 1.0.0
`,
    createManifest,
  );
  assert.deepEqual(manifest.dependencies.packages, [
    { name: "root", version: "1.0.0", integrity, dependencies: { root: "1.0.0" } },
  ]);
});

test("rejects SHA-512 base64 with noncanonical pad bits", async () => {
  await assert.rejects(
    withFixture(`  root@1.0.0: {}\n`, createManifest, `sha512-${"B".repeat(86)}==`),
  );
});

test("accepts the platform workspace source-file boundary and rejects one byte above it", async () => {
  await withFixture(`  root@1.0.0: {}\n`, async (root) => {
    await writeFile(
      join(root, "src/workspace-boundary.ts"),
      "x".repeat(WORKSPACE_VALUE_MAX_BYTES),
    );
    await assert.doesNotReject(createManifest(root));
    await writeFile(
      join(root, "src/workspace-boundary.ts"),
      "x".repeat(WORKSPACE_VALUE_MAX_BYTES + 1),
    );
    await assert.rejects(createManifest(root), /invalid source file/);
  });
});

test("uses the Worker bundle identity contract, including the canonical catalog digest", async () => {
  await withFixture(`  root@1.0.0: {}\n`, async (root) => {
    const first = await createManifest(root);
    const expected = createHash("sha256")
      .update(
        canonicalJson({
          runtime: first.runtime,
          dependencyDigest: first.dependencies.dependencyDigest,
          catalogDigest: first.catalog.catalogDigest,
          files: first.code.files
            .slice()
            .sort((left, right) => compareCodePoints(left.path, right.path))
            .map(({ path, size, sha256 }) => ({
              path,
              size,
              sha256,
            })),
        }),
      )
      .digest("hex");
    assert.equal(first.code.bundleDigest, expected);

    await writeFile(join(root, "generated/openui-catalog.json"), " { }\n");
    const whitespaceOnly = await createManifest(root);
    assert.equal(whitespaceOnly.catalog.catalogDigest, first.catalog.catalogDigest);
    assert.equal(whitespaceOnly.code.bundleDigest, first.code.bundleDigest);

    await writeFile(join(root, "generated/openui-catalog.json"), '{ "tools": [] }\n');
    const second = await createManifest(root);
    assert.notEqual(second.catalog.catalogDigest, first.catalog.catalogDigest);
    assert.notEqual(second.code.bundleDigest, first.code.bundleDigest);
  });
});
