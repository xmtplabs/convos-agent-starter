import { SiteError } from "./error.js";

const unsafeConfigName = /^(?:alias\.|include(?:if)?\.|url\.|http\.|credential\.|filter\.|core\.(?:askpass|attributesfile|fsmonitor|gitproxy|hookspath|sshcommand)|remote\..+\.proxy$)/i;

/** Reject local configuration that can execute code or redirect HTTPS traffic. */
export function assertSafeLocalGitConfig(names: string): void {
  for (const name of names.split("\0")) {
    if (!name) continue;
    if (unsafeConfigName.test(name)) {
      throw new SiteError(
        "deployment_failed",
        "deployment",
        "unsafe local Git configuration",
      );
    }
  }
}
