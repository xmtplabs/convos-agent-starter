export function requiredEnvironment(name, environment = process.env) {
  const value = environment[name]?.trim();
  if (!value) throw new Error(`set ${name} in the runtime environment`);
  return value;
}

export function requiredUrl(name, environment = process.env) {
  const value = requiredEnvironment(name, environment);
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error();
    }
    return url;
  } catch {
    throw new Error(`${name} must be an absolute URL`);
  }
}

export function buildPinnedSiteUrl(publicBaseUrl, instanceId) {
  return new URL(
    `/sites/${encodeURIComponent(instanceId)}/`,
    publicBaseUrl,
  );
}
