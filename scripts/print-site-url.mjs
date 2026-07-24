import {
  buildPinnedSiteUrl,
  requiredEnvironment,
  requiredUrl,
} from "./site-location.mjs";

const publicBaseUrl = requiredUrl("PUBLIC_BASE_URL");
const instanceId = requiredEnvironment("INSTANCE_ID");

console.log(buildPinnedSiteUrl(publicBaseUrl, instanceId).href);
