import type { Config } from "@react-router/dev/config";

export default {
  appDirectory: "src",
  buildDirectory: "dist",
  routeDiscovery: { mode: "initial" },
  ssr: true,
} satisfies Config;
