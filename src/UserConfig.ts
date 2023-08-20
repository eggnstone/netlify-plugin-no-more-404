export class UserConfig
{
    public readonly error?: string;
    public readonly on404: string;
    public readonly cacheKey: string;

    private constructor(params: {
        error?: string,
        on404?: string,
        cacheKey?: string
    })
    {
        this.error = params.error;
        this.on404 = params.on404 == "warn" ? "warn" : "error";
        this.cacheKey = params.cacheKey ?? "";
    }

    public static create(inputs: any): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        let on404 = inputs["on404"];
        let cacheKey = inputs["cacheKey"];

        const cacheKeys = inputs["cacheKeys"];
        const environmentVariableName = inputs["environmentVariableName"];

        console.log("    on404:          " + on404);
        console.log("    cacheKey:       " + cacheKey);
        console.log("    cacheKeys:      " + JSON.stringify(cacheKeys));
        console.log("    envVarName:     " + environmentVariableName);

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

            console.log("    Final cacheKey: " + cacheKey);
        }

        return new UserConfig({on404: on404, cacheKey: cacheKey});
    }
}
