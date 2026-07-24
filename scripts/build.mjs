import { rename, rm } from "node:fs/promises";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
function run(command, args) { return new Promise((resolvePromise, reject) => { const child = spawn(command, args, { cwd: root, stdio: "inherit", shell: process.platform === "win32" }); child.on("error", reject); child.on("exit", (code) => code === 0 ? resolvePromise() : reject(new Error(`${command} exited with ${code}`))); }); }
await rm(resolve(root, "dist"), { recursive: true, force: true });
await rm(resolve(root, "public"), { recursive: true, force: true });
await run("pnpm", ["exec", "react-router", "build"]);
await rename(resolve(root, "dist/client"), resolve(root, "public"));
await rm(resolve(root, "dist/server/.vite"), { recursive: true, force: true });
await rm(resolve(root, "dist/server/wrangler.json"), { force: true });
await run("node", ["scripts/build-site-manifest.mjs"]);
await run("node", ["scripts/validate-artifacts.mjs"]);
