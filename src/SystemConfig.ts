import * as path from "path";

export class SystemConfig
{
    private readonly _error?: string;

    private readonly _fullCacheDir: string;
    private readonly _fullPublishDir: string;

    private constructor(params: {
        error?: string,
        fullCacheDir: string,
        fullPublishDir: string
    })
    {
        this._error = params.error;
        this._fullCacheDir = params.fullCacheDir;
        this._fullPublishDir = params.fullPublishDir;
    }

    public get error()
    {
        return this._error;
    }

    public get fullCacheDir()
    {
        return this._fullCacheDir;
    }

    public get fullPublishDir()
    {
        return this._fullPublishDir;
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
        const fullPublishDir = path.join(process.cwd(), publishDir);

        console.log("  fullCacheDir: " + fullCacheDir);
        console.log("  fullPublishDir: " + fullPublishDir);

        return new SystemConfig({fullCacheDir: fullCacheDir, fullPublishDir: fullPublishDir});
    }
}
