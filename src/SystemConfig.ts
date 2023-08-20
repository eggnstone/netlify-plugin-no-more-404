import * as path from "path";

export class SystemConfig
{
    public readonly error?: string;
    public readonly fullCacheDir: string;
    public readonly fullPublishDir: string;

    private constructor(params: {
        error?: string,
        fullCacheDir: string,
        fullPublishDir: string
    })
    {
        this.error = params.error;
        this.fullCacheDir = params.fullCacheDir;
        this.fullPublishDir = params.fullPublishDir;
    }

    public static create(constants: any): SystemConfig
    {
        if (!constants)
            return new SystemConfig({error: "constants not set.", fullCacheDir: "", fullPublishDir: ""});

        let cacheDir = constants["CACHE_DIR"];
        if (!cacheDir)
            return new SystemConfig({error: "cacheDir not set.", fullCacheDir: "", fullPublishDir: ""});

        let publishDir = constants["PUBLISH_DIR"];
        if (!publishDir)
            return new SystemConfig({error: "publishDir not set.", fullCacheDir: "", fullPublishDir: ""});

        const fullCacheDir = path.join(process.cwd(), cacheDir);
        console.log("    cacheDir:       " + cacheDir);
        console.log("    fullCacheDir:   " + fullCacheDir);

        const fullPublishDir = path.join(process.cwd(), publishDir);
        console.log("    publishDir:     " + publishDir);
        console.log("    fullPublishDir: " + fullPublishDir);

        return new SystemConfig({fullCacheDir: fullCacheDir, fullPublishDir: fullPublishDir});
    }
}
