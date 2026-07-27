export type SiteErrorCode =
  | "invalid_argument"
  | "invalid_configuration"
  | "invalid_manifest"
  | "invalid_page"
  | "invalid_dependency"
  | "render_failed"
  | "typecheck_failed"
  | "deployment_failed";

export class SiteError extends Error {
  constructor(
    readonly code: SiteErrorCode,
    readonly phase: "configuration" | "manifest" | "page" | "render" | "typecheck" | "deployment",
    message: string,
    readonly details: Record<string, string | number | boolean> = {},
  ) {
    super(message);
  }
}

export function errorJson(error: unknown): string {
  const siteError = error instanceof SiteError
    ? error
    : new SiteError("deployment_failed", "deployment", "operation failed");
  return `${JSON.stringify({
    code: siteError.code,
    phase: siteError.phase,
    ...siteError.details,
  })}\n`;
}
