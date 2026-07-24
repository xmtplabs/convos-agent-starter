declare module "*.mjs" {
  const artifact: {
    manifest: {
      compatibilityDate: string;
      compatibilityFlags: string[];
      mainModule: string;
      artifactDigest: string;
      modules: Array<{
        moduleName: string;
        type: "js";
        size: number;
        sha256: string;
      }>;
      assets: Array<{
        urlPath: string;
        contentType: string;
        size: number;
        sha256: string;
      }>;
    };
    modules: Array<{ moduleName: string; type: "js"; text: string }>;
    assets: Array<{
      urlPath: string;
      contentType: string;
      size: number;
      sha256: string;
      base64: string;
    }>;
    commitSha: string;
  };
  export default artifact;
}
