import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let formatError: (error: unknown) => string = () =>
  `${JSON.stringify({ code: "render_failed", phase: "render" })}\n`;

process.stdout.on("error", (error: NodeJS.ErrnoException) => {
  if (error.code === "EPIPE") process.exit(0);
  throw error;
});

try {
  const errorModule = await import("./lib/error.js");
  formatError = (error: unknown) =>
    error instanceof errorModule.SiteError
      ? errorModule.errorJson(error)
      : `${JSON.stringify({
          code: "render_failed",
          phase: "render",
      })}\n`;
  const { createManifest } = await import("./lib/manifest.js");
  const { renderFixturePage } = await import("./lib/render.js");
  await createManifest(root);
  const result = await renderFixturePage(
    root,
    process.argv.find((argument, index) => index > 1 && argument !== "--") ??
      "",
  );
  process.stdout.write(result.html);
} catch (error) {
  process.stderr.write(formatError(error));
  process.exitCode = 1;
}
