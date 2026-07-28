/** Trusted request metadata injected by the agent-site host. */
export const SITE_BASE_PATH_HEADER = "x-convos-site-base-path";
export const SITE_BUNDLE_DIGEST_HEADER = "x-convos-site-bundle-digest";

/**
 * Public bundle identity returned with page content. The host deliberately
 * strips x-convos-* response headers before returning a site response.
 */
export const PAGE_BUNDLE_DIGEST_HEADER = "x-agent-site-bundle-digest";
