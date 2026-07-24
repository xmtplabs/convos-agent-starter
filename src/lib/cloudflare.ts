import { createContext } from "react-router";

export type CloudflareLoadContext = {
  env: Env;
  ctx: ExecutionContext;
};

export const cloudflareContext = createContext<CloudflareLoadContext>();
export const siteBasePathContext = createContext<string>();
