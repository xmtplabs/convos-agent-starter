import { useEffect, useState } from "react";
import { PAGE_BUNDLE_DIGEST_HEADER } from "./runtime-contract.js";

export type OpenUiPageStatus = "loading" | "ready" | "error";
export type OpenUiPage = {
  status: OpenUiPageStatus;
  source: string | null;
  stale: boolean;
  error: string | null;
  headers: Record<string, string>;
};

export type UseOpenUiPageOptions = {
  route: string;
  expectedBundleDigest: string;
  /** Historical pages are immutable and deliberately fetch exactly once. */
  historical?: boolean;
};

export type PageResponseDecision =
  | "accept"
  | "unchanged"
  | "reload"
  | "removed"
  | "fail"
  | "transient";

export type PagePollerDependencies = {
  fetchPage: (
    input: RequestInfo | URL,
    init?: RequestInit,
  ) => Promise<Response>;
  visible: () => boolean;
  reload: () => void;
  setTimer: (callback: () => void, delay: number) => unknown;
  clearTimer: (timer: unknown) => void;
};

const POLL_INTERVAL_MS = 5_000;
const headerRecord = (): Record<string, string> =>
  Object.create(null) as Record<string, string>;
const initialPage = (): OpenUiPage => ({
  status: "loading",
  source: null,
  stale: false,
  error: null,
  headers: headerRecord(),
});

export function classifyPageResponse(
  status: number,
  receivedBundleDigest: string | null,
  expectedBundleDigest: string,
  hasGoodSource: boolean,
): PageResponseDecision {
  if (status === 404) return hasGoodSource ? "removed" : "fail";
  if (status !== 200 && status !== 304) return "transient";
  if (status === 304 && !hasGoodSource) return "fail";
  if (!receivedBundleDigest) return "fail";
  if (receivedBundleDigest !== expectedBundleDigest) return "reload";
  return status === 304 ? "unchanged" : "accept";
}

function responseHeaders(response: Response): Record<string, string> {
  return Object.fromEntries(response.headers.entries());
}

export class OpenUiPageController {
  private state = initialPage();
  private headers = headerRecord();
  private hasGoodSource = false;
  private request: AbortController | null = null;
  private timer: unknown;
  private stopped = true;
  private reloadTriggered = false;

  constructor(
    private readonly options: Required<UseOpenUiPageOptions>,
    private readonly dependencies: PagePollerDependencies,
    private readonly onChange: (page: OpenUiPage) => void,
  ) {}

  getState(): OpenUiPage {
    return this.state;
  }

  async start(): Promise<void> {
    this.stopped = false;
    this.headers = headerRecord();
    this.hasGoodSource = false;
    this.update(initialPage());
    await this.check();
  }

  stop(): void {
    this.stopped = true;
    this.clearScheduled();
    this.request?.abort();
  }

  visibilityChanged(): void {
    if (this.options.historical) return;
    if (!this.dependencies.visible()) {
      this.clearScheduled();
      return;
    }
    this.clearScheduled();
    void this.check();
  }

  online(): void {
    if (this.options.historical) return;
    if (!this.dependencies.visible()) return;
    this.clearScheduled();
    void this.check();
  }

  async check(): Promise<void> {
    if (
      this.stopped ||
      this.request !== null ||
      (!this.options.historical && !this.dependencies.visible())
    ) {
      return;
    }
    const controller = new AbortController();
    this.request = controller;
    try {
      const requestHeaders = new Headers();
      if (this.headers.etag) {
        requestHeaders.set("if-none-match", this.headers.etag);
      }
      const response = await this.dependencies.fetchPage(
        `__convos/page?route=${encodeURIComponent(this.options.route)}`,
        { headers: requestHeaders, signal: controller.signal },
      );
      const decision = classifyPageResponse(
        response.status,
        response.headers.get(PAGE_BUNDLE_DIGEST_HEADER),
        this.options.expectedBundleDigest,
        this.hasGoodSource,
      );
      if (decision === "transient") {
        throw new Error(`The page could not be loaded (${response.status}).`);
      }
      if (decision === "reload") {
        this.reload();
        return;
      }
      if (decision === "removed") {
        if (!this.options.historical) {
          this.reload();
          return;
        }
        throw new Error("The page could not be loaded (404).");
      }
      if (decision === "fail") {
        throw new Error(
          response.status === 404
            ? "The page could not be loaded (404)."
            : response.status === 304
              ? "The page returned an invalid initial not-modified response."
              : "The page response is missing its bundle identity.",
        );
      }
      const receivedHeaders = responseHeaders(response);
      if (decision === "unchanged") {
        this.headers = { ...this.headers, ...receivedHeaders };
        this.update({
          ...this.state,
          stale: false,
          error: null,
          headers: this.headers,
        });
        return;
      }
      const source = await response.text();
      if (!source) throw new Error("The page is empty.");
      this.headers = receivedHeaders;
      this.hasGoodSource = true;
      this.update({
        status: "ready",
        source,
        stale: false,
        error: null,
        headers: receivedHeaders,
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      const message =
        error instanceof Error
          ? error.message
          : "The page could not be loaded.";
      this.update(
        this.state.source
          ? { ...this.state, stale: true, error: message }
          : {
              status: "error",
              source: null,
              stale: false,
              error: message,
              headers: this.headers,
            },
      );
    } finally {
      this.request = null;
      if (
        !this.stopped &&
        !this.options.historical &&
        this.dependencies.visible()
      ) {
        this.schedule();
      }
    }
  }

  private update(page: OpenUiPage): void {
    this.state = page;
    this.onChange(page);
  }

  private schedule(): void {
    this.clearScheduled();
    this.timer = this.dependencies.setTimer(
      () => void this.check(),
      POLL_INTERVAL_MS,
    );
  }

  private reload(): void {
    if (this.reloadTriggered) return;
    this.reloadTriggered = true;
    this.stopped = true;
    this.clearScheduled();
    this.dependencies.reload();
  }

  private clearScheduled(): void {
    if (this.timer === undefined) return;
    this.dependencies.clearTimer(this.timer);
    this.timer = undefined;
  }
}

/**
 * Fetches source before the Renderer mounts. Pinned pages revalidate five
 * seconds after the previous request completes; historical pages fetch once.
 */
export function useOpenUiPage({
  route,
  expectedBundleDigest,
  historical = false,
}: UseOpenUiPageOptions): OpenUiPage {
  const [page, setPage] = useState<OpenUiPage>(initialPage);

  useEffect(() => {
    const controller = new OpenUiPageController(
      { route, expectedBundleDigest, historical },
      {
        fetchPage: (input, init) => fetch(input, init),
        visible: () => document.visibilityState === "visible",
        reload: () => window.location.reload(),
        setTimer: (callback, delay) => window.setTimeout(callback, delay),
        clearTimer: (timer) => window.clearTimeout(timer as number),
      },
      setPage,
    );
    const visibilityChanged = () => controller.visibilityChanged();
    const online = () => controller.online();
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("online", online);
    void controller.start();
    return () => {
      controller.stop();
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("online", online);
    };
  }, [expectedBundleDigest, historical, route]);

  return page;
}
