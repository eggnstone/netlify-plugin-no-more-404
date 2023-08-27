export class UserConfig
{
    public readonly error?: string;

    public readonly cacheKey: string;
    public readonly debugUnused: boolean;
    public readonly failBuildOnError: boolean;

    private constructor(params: {
        error?: string,
        cacheKey?: string,
        debug?: boolean,
        failBuildOnError?: boolean
    })
    {
        this.error = params.error;
        this.cacheKey = params.cacheKey ?? "";
        this.debugUnused = params.debug ?? true;
        this.failBuildOnError = params.failBuildOnError ?? true;
    }

    public static create(inputs: any, logAll: boolean): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        let failBuildOnError = inputs["failBuildOnError"];
        let cacheKey = inputs["cacheKey"];

        const cacheKeys = inputs["cacheKeys"];
        const environmentVariableName = inputs["environmentVariableName"];
        const debug = inputs["debug"] ?? true;

        if (logAll)
        {
            const failBuildOnErrorText = failBuildOnError === undefined ? "<undefined>" : failBuildOnError;
            const cacheKeyText = cacheKey === undefined ? "<undefined>" : cacheKey.length == 0 ? "<empty>" : '"' + cacheKey + '"';
            const cacheKeysText = (Array.isArray(cacheKeys) ? cacheKeys.length : "no") + " items";
            const envVarNameText = environmentVariableName === undefined ? "<undefined>" : environmentVariableName.length == 0 ? "<empty>" : '"' + environmentVariableName + '"';
            console.log("    failBuildOnError: " + failBuildOnErrorText);
            console.log("    cacheKey:         " + cacheKeyText);
            console.log("    cacheKeys:        " + cacheKeysText);
            console.log("    envVarName:       " + envVarNameText);
            //console.log("    debug:            " + debug);
        }

        if (failBuildOnError != true && failBuildOnError != false)
            return new UserConfig({error: "failBuildOnError must be true or false."});

        if (cacheKey)
        {
            if (environmentVariableName || cacheKeys)
                if (logAll) console.log("  cacheKey set. Ignoring environmentVariableName and cacheKeys.");
        }
        else
        {
            if (!environmentVariableName || !cacheKeys)
                return new UserConfig({error: "cacheKey not set, then cacheKeys and environmentVariableName must be set.", failBuildOnError});

            const environmentVariableValue = process.env[environmentVariableName];
            if (!environmentVariableValue)
                return new UserConfig({error: "Environment variable \"" + environmentVariableName + "\" not set.", failBuildOnError});

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
                new UserConfig({error: "No cache key found for \"" + environmentVariableValue + "\" in " + JSON.stringify(cacheKeys) + ".", failBuildOnError});

            if (logAll) console.log("    Final cacheKey:   " + cacheKey);
        }

        return new UserConfig({failBuildOnError, cacheKey, debug});
    }
}
