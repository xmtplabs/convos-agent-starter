import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
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

test("rejects repository paths containing URL delimiters", async () => {
  for (const path of ["src/hash#name.ts", "src/encoded%41.ts"]) {
    await assert.rejects(
      withFixture(`  root@1.0.0: {}\n`, async (root) => {
        await writeFile(join(root, path), "export {}");
        return createManifest(root);
      }),
      /unsafe path/,
    );
  }
});

test("rejects page and asset URLs outside the platform path grammar", async () => {
  for (const filename of [
    "raw space",
    'double"quote',
    "less<than",
    "greater>than",
    "back`tick",
  ]) {
    await assert.rejects(
      withFixture(`  root@1.0.0: {}\n`, async (root) => {
        await writeFile(
          join(root, "pages", `${filename}.openui`),
          'Page("Invalid", [])',
        );
        return createManifest(root);
      }),
      /invalid page route/,
    );
  }

  await assert.rejects(
    withFixture(`  root@1.0.0: {}\n`, async (root) => {
      await mkdir(join(root, "assets"));
      await writeFile(join(root, "assets", "raw space.txt"), "invalid");
      return createManifest(root);
    }),
    /invalid asset URL/,
  );
});

test("rejects page routes that shadow runtime assets", async () => {
  for (const route of ["styles.css", "client.js"]) {
    await assert.rejects(
      withFixture(`  root@1.0.0: {}\n`, async (root) => {
        await writeFile(
          join(root, "pages", `${route}.openui`),
          'Page("Shadowed", [])',
        );
        return createManifest(root);
      }),
      /page route conflicts with a runtime asset/,
    );
  }
});

test("rejects compiled client URLs that collide with static assets", async () => {
  await assert.rejects(
    withFixture(`  root@1.0.0: {}\n`, async (root) => {
      const packageJson = JSON.parse(
        await readFile(join(root, "package.json"), "utf8"),
      ) as {
        convos: { site: { client: string } };
      };
      packageJson.convos.site.client = "src/assets/client.ts";
      await mkdir(join(root, "src", "assets"));
      await mkdir(join(root, "assets"));
      await Promise.all([
        writeFile(join(root, "package.json"), JSON.stringify(packageJson)),
        writeFile(join(root, "src", "assets", "client.ts"), "export {}"),
        writeFile(join(root, "assets", "client.js"), "static"),
      ]);
      return createManifest(root);
    }),
    /runtime client conflicts with a static asset URL/,
  );
});

test("separates executable bundle identity from static page and asset content", async () => {
  await withFixture(`  root@1.0.0: {}\n`, async (root) => {
    const first = await createManifest(root);
    const expectedBundle = createHash("sha256")
      .update(
        canonicalJson({
          runtime: first.runtime,
          dependencyDigest: first.dependencies.dependencyDigest,
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
    const expectedContent = createHash("sha256")
      .update(
        canonicalJson({
          assets: first.assets
            .slice()
            .sort((left, right) =>
              compareCodePoints(left.urlPath, right.urlPath),
            )
            .map(({ urlPath, contentType, path, size, sha256 }) => ({
              urlPath,
              contentType,
              path,
              size,
              sha256,
            })),
        }),
      )
      .digest("hex");
    assert.equal(first.code.bundleDigest, expectedBundle);
    assert.equal(first.contentDigest, expectedContent);
    assert.deepEqual(Object.keys(first).sort(), [
      "assets",
      "code",
      "contentDigest",
      "dependencies",
      "deploymentDigest",
      "gitObjectFormat",
      "runtime",
      "schemaVersion",
    ]);
    assert.deepEqual(
      first.assets.map(({ path, urlPath, contentType }) => ({
        path,
        urlPath,
        contentType,
      })),
      [
        {
          path: "pages/index.openui",
          urlPath: "/__convos/pages/index.openui",
          contentType: "text/plain; charset=utf-8",
        },
        {
          path: "src/styles.css",
          urlPath: "/styles.css",
          contentType: "text/css",
        },
      ],
    );

    await writeFile(join(root, "generated/openui-catalog.json"), " { }\n");
    await writeFile(join(root, "generated/openui-system-prompt.txt"), "changed");
    const generatedOnly = await createManifest(root);
    assert.deepEqual(generatedOnly, first);

    await writeFile(join(root, "pages/index.openui"), 'Page("Changed", [])');
    const pageChanged = await createManifest(root);
    assert.equal(pageChanged.code.bundleDigest, first.code.bundleDigest);
    assert.notEqual(pageChanged.contentDigest, first.contentDigest);

    await writeFile(join(root, "src/styles.css"), "body {}");
    const stylesheetChanged = await createManifest(root);
    assert.equal(
      stylesheetChanged.code.bundleDigest,
      pageChanged.code.bundleDigest,
    );
    assert.notEqual(
      stylesheetChanged.contentDigest,
      pageChanged.contentDigest,
    );

    await writeFile(join(root, "src/server.ts"), "export default { fetch() {} }");
    const codeChanged = await createManifest(root);
    assert.notEqual(codeChanged.code.bundleDigest, first.code.bundleDigest);
    assert.equal(codeChanged.contentDigest, stylesheetChanged.contentDigest);
  });
});
