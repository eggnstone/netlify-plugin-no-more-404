export class UserConfig
{
    private readonly _error?: string;

    private readonly _on404: string;
    private readonly _cacheKey: string;

    private constructor(params: {
        error?: string,
        on404?: string,
        cacheKey?: string
    })
    {
        this._error = params.error;
        this._on404 = params.on404 == "warn" ? "warn" : "error";
        this._cacheKey = params.cacheKey ?? "";
    }

    public get error()
    {
        return this._error;
    }

    public get on404()
    {
        return this._on404;
    }

    public get cacheKey()
    {
        return this._cacheKey;
    }

    public static create(inputs: any): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        let on404 = inputs["on404"];
        let cacheKey = inputs["cacheKey"];

        const cacheKeys = inputs["cacheKeys"];
        const environmentVariableName = inputs["environmentVariableName"];

        if (on404 != "warn" && on404 != "error")
            return new UserConfig({error: "on404 must be \"error\" or \"warn\"."});

        if (cacheKey)
        {
            if (environmentVariableName || cacheKeys)
                console.log("  cacheKey set. Ignoring environmentVariableName and cacheKeys.");
        }
        else
        {
            if (!environmentVariableName || !cacheKeys)
                return new UserConfig({error: "cacheKey not set, then cacheKeys and environmentVariableName must be set.", on404: on404});

            const environmentVariableValue = process.env[environmentVariableName];
            if (!environmentVariableValue)
                return new UserConfig({error: "Environment variable \"" + environmentVariableName + "\" not set.", on404: on404});

            cacheKey = cacheKeys[environmentVariableValue];
            if (!cacheKey)
                new UserConfig({error: "No cache key found for \"" + environmentVariableValue + "\" in " + JSON.stringify(cacheKeys) + ".", on404: on404});
        }

        /*


let cacheKey;
    let key;
    for (key of config.cacheKeys)
    {
        if (key.startsWith(configName + "_"))
        {
            cacheKey = key;
            break;
        }
    }



    if (!cacheKey)
    {
        utilsBuild.failBuild("No matching cache key found for CONFIG_NAME=" + configName);
        return;
    }

         */

        return new UserConfig({on404: on404, cacheKey: cacheKey});
    }
}
