export class UserConfig
{
    public static readonly CHECK_IN_PREFLIGHT_DEFAULT = false;
    public static readonly DEBUG_DEFAULT = false;
    public static readonly FAIL_BUILD_ON_ERROR_DEFAULT = true;

    public readonly error?: string;

    public readonly cacheKey: string;
    public readonly checkInPreflight: boolean;
    public readonly debugUnused: boolean;
    public readonly failBuildOnError: boolean;

    private constructor(params: {
        error?: string,
        cacheKey?: string,
        checkInPreflight?: boolean,
        debug?: boolean,
        failBuildOnError?: boolean
    })
    {
        this.error = params.error;
        this.cacheKey = params.cacheKey ?? "";
        this.checkInPreflight = params.checkInPreflight ?? UserConfig.CHECK_IN_PREFLIGHT_DEFAULT;
        this.debugUnused = params.debug ?? UserConfig.DEBUG_DEFAULT;
        this.failBuildOnError = params.failBuildOnError ?? UserConfig.FAIL_BUILD_ON_ERROR_DEFAULT;
    }

    public static create(inputs: any, logAll: boolean): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        const failBuildOnError = inputs["failBuildOnError"];
        let cacheKey = inputs["cacheKey"];
        const cacheKeys = inputs["cacheKeys"];
        const environmentVariableName = inputs["environmentVariableName"];
        const debug = inputs["debug"];
        const checkInPreflight = inputs["checkInPreflight"];

        if (logAll)
        {
            const cacheKeyText = cacheKey === undefined ? "<undefined>" : cacheKey.length == 0 ? "<empty>" : '"' + cacheKey + '"';
            const cacheKeysText = Array.isArray(cacheKeys) ? cacheKeys.length == 1 ? "1 item" : cacheKeys.length + " items" : "no items";
            const envVarNameText = environmentVariableName === undefined ? "<undefined>" : environmentVariableName.length == 0 ? "<empty>" : '"' + environmentVariableName + '"';
            console.log("    failBuildOnError: " + failBuildOnError);
            console.log("    cacheKey:         " + cacheKeyText);
            console.log("    cacheKeys:        " + cacheKeysText);
            console.log("    envVarName:       " + envVarNameText);
            //console.log("    debug:            " + debug );
            console.log("    checkInPreflight: " + checkInPreflight);
        }

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
                return new UserConfig({error: 'Environment variable "' + environmentVariableName + '" not set.', failBuildOnError});

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
                return new UserConfig({error: 'No cache key found for "' + environmentVariableValue + '" in ' + JSON.stringify(cacheKeys) + ".", failBuildOnError});

            if (logAll) console.log('    Final cacheKey:   "' + cacheKey + '"');
        }

        return new UserConfig({failBuildOnError, cacheKey, debug, checkInPreflight});
    }
}
