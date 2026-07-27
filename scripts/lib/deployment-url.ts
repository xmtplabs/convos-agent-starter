const INTERNAL_POOL_ORIGIN = "http://runtime.internal";

function parseUrl(value: string): URL | undefined {
  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}

export function credentialFreeHttpsUrl(value: string): URL | undefined {
  const parsed = parseUrl(value);
  if (
    !parsed ||
    parsed.protocol !== "https:" ||
    parsed.username !== "" ||
    parsed.password !== ""
  ) {
    return undefined;
  }
  return parsed;
}

export function poolUrl(value: string): URL | undefined {
  const https = credentialFreeHttpsUrl(value);
  if (https) return https;

  const parsed = parseUrl(value);
  if (
    !parsed ||
    parsed.origin !== INTERNAL_POOL_ORIGIN ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.port !== "" ||
    parsed.pathname !== "/" ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    return undefined;
  }
  return parsed;
}

export function runtimeGitUrl(value: string, instanceId: string): URL | undefined {
  const parsed = parseUrl(value);
  const expectedPath = `/api/internal/sites/git/agents-${encodeURIComponent(instanceId)}.git`;
  if (
    !parsed ||
    parsed.origin !== INTERNAL_POOL_ORIGIN ||
    parsed.username !== "" ||
    parsed.password !== "" ||
    parsed.port !== "" ||
    parsed.pathname !== expectedPath ||
    parsed.search !== "" ||
    parsed.hash !== ""
  ) {
    return undefined;
  }
  return parsed;
}
