import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { renderFixtureOpenUiDocument, OpenUiRenderError } from "../../src/server.js";
import { isSafeRelativePath } from "./config.js";
import { SiteError } from "./error.js";

export function pagePath(root: string, target: string): string {
  if (!target) throw new SiteError("invalid_argument", "page", "a page route or .openui file is required");
  if (target.startsWith("/")) {
    if (
      target !== "/" &&
      (!isSafeRelativePath(target.slice(1)) ||
        /[?#%]/.test(target) ||
        target === "/__convos" ||
        target.startsWith("/__convos/"))
    ) {
      throw new SiteError("invalid_argument", "page", "invalid route");
    }
    if (target === "/") return resolve(root, "pages/index.openui");
    const stem = target.slice(1);
    const candidates = [
      resolve(root, "pages", `${stem}.openui`),
      resolve(root, "pages", stem, "index.openui"),
    ].filter(existsSync);
    if (candidates.length !== 1) {
      throw new SiteError(
        "invalid_page",
        "page",
        candidates.length === 0
          ? "page file was not found"
          : "page route is ambiguous",
      );
    }
    return candidates[0];
  }
  if (
    !target.startsWith("pages/") ||
    !target.endsWith(".openui") ||
    !isSafeRelativePath(target) ||
    /[\[\]:$]/.test(target)
  ) {
    throw new SiteError("invalid_argument", "page", "expected a route or .openui file");
  }
  const file = resolve(root, target);
  if (!file.startsWith(`${resolve(root, "pages")}/`)) throw new SiteError("invalid_argument", "page", "page file must be beneath pages");
  return file;
}

export async function renderFixturePage(root: string, target: string, queryMode: "live" | "defaults" = "live") {
  let source: string;
  try { source = await readFile(pagePath(root, target), "utf8"); }
  catch { throw new SiteError("invalid_page", "page", "page file was not found"); }
  try { return await renderFixtureOpenUiDocument(source, queryMode); }
  catch (error) {
    if (error instanceof OpenUiRenderError) throw new SiteError("render_failed", "render", error.message, { openui_code: error.code });
    throw error;
  }
}
