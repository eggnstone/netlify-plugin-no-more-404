export class UserConfig
{
    public readonly error?: string;

    public readonly cacheKey: string;
    public readonly debug2: boolean;
    public readonly on404: string;

    private constructor(params: {
        error?: string,
        cacheKey?: string,
        debug?: boolean,
        on404?: string
    })
    {
        this.error = params.error;
        this.on404 = params.on404 == "warn" ? "warn" : "error";
        this.cacheKey = params.cacheKey ?? "";
        this.debug2 = params.debug ?? true;
    }

    public static create(inputs: any, logAll: boolean): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        let on404 = inputs["on404"];
        let cacheKey = inputs["cacheKey"];

        const cacheKeys = inputs["cacheKeys"];
        const environmentVariableName = inputs["environmentVariableName"];
        const debug = inputs["debug"] ?? true;

        if (logAll)
        {
            console.log("    on404:          " + on404);
            console.log("    cacheKey:       " + cacheKey);
            console.log("    cacheKeys:      " + JSON.stringify(cacheKeys));
            console.log("    envVarName:     " + environmentVariableName);
            //console.log("    debug:          " + debug);
        }

        if (on404 != "warn" && on404 != "error")
            return new UserConfig({error: "on404 must be \"error\" or \"warn\"."});

        if (cacheKey)
        {
            if (environmentVariableName || cacheKeys)
                if (logAll) console.log("  cacheKey set. Ignoring environmentVariableName and cacheKeys.");
        }
        else
        {
            if (!environmentVariableName || !cacheKeys)
                return new UserConfig({error: "cacheKey not set, then cacheKeys and environmentVariableName must be set.", on404: on404});

            const environmentVariableValue = process.env[environmentVariableName];
            if (!environmentVariableValue)
                return new UserConfig({error: "Environment variable \"" + environmentVariableName + "\" not set.", on404: on404});

            let key;
            for (key of cacheKeys)
            {
                if (key.startsWith(environmentVariableValue + "_"))
                {
                    cacheKey = key;
                    break;
                }
            }

            if (!cacheKey)
                new UserConfig({error: "No cache key found for \"" + environmentVariableValue + "\" in " + JSON.stringify(cacheKeys) + ".", on404: on404});

            if (logAll) console.log("    Final cacheKey: " + cacheKey);
        }

        return new UserConfig({on404: on404, cacheKey: cacheKey, debug: debug});
    }
}
