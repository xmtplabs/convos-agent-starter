interface Env {
  LOCAL_ARTIFACTS?: KVNamespace;
}

interface PreviewEnv {
  AGENT_SERVER: DurableObjectNamespace;
  LOCAL_ARTIFACTS: KVNamespace;
  SITE_BLOBS: KVNamespace;
  SITE_LOADER: WorkerLoader;
}
