import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),
  route("redirect", "routes/redirect.ts"),
  route("resource.txt", "routes/resource.ts"),
  route("error", "routes/error.tsx"),
] satisfies RouteConfig;
