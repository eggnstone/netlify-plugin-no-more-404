export class UserConfig
{
    public static readonly DEBUG_DEFAULT = false;
    public static readonly COMMAND_ON_ERROR_DEFAULT = "";
    public static readonly COMMAND_ON_SUCCESS_DEFAULT = "";
    public static readonly FAIL_BUILD_ON_ERROR_DEFAULT = false;
    public static readonly FAIL_PLUGIN_ON_ERROR_DEFAULT = false;
    public static readonly SKIP_PATTERNS_DEFAULT: string[] = [];

    public readonly error?: string;

    public readonly cacheKey: string;
    public readonly debugUnused: boolean;
    public readonly commandOnError: string;
    public readonly commandOnSuccess: string;
    public readonly failBuildOnError: boolean;
    public readonly failPluginOnError: boolean;
    public readonly skipPatterns: string[];

    private constructor(params: {
        error?: string,
        cacheKey?: string,
        debug?: boolean,
        commandOnError?: string,
        commandOnSuccess?: string,
        failBuildOnError?: boolean,
        failPluginOnError?: boolean,
        skipPatterns?: string[]
    })
    {
        this.error = params.error;
        this.cacheKey = params.cacheKey ?? "";
        this.debugUnused = params.debug ?? UserConfig.DEBUG_DEFAULT;
        this.commandOnError = params.commandOnError ?? UserConfig.COMMAND_ON_ERROR_DEFAULT;
        this.commandOnSuccess = params.commandOnSuccess ?? UserConfig.COMMAND_ON_SUCCESS_DEFAULT;
        this.failBuildOnError = params.failBuildOnError ?? UserConfig.FAIL_BUILD_ON_ERROR_DEFAULT;
        this.failPluginOnError = params.failPluginOnError ?? UserConfig.FAIL_PLUGIN_ON_ERROR_DEFAULT;
        this.skipPatterns = params.skipPatterns ?? UserConfig.SKIP_PATTERNS_DEFAULT;
    }

    public static create(inputs: any, logAll: boolean): UserConfig
    {
        if (!inputs)
            return new UserConfig({error: "inputs not set."});

        let cacheKey = inputs["cacheKey"];
        const cacheKeys = inputs["cacheKeys"];
        const debug = inputs["debug"];
        const environmentVariableName = inputs["environmentVariableName"];
        const commandOnError = inputs["commandOnError"];
        const commandOnSuccess = inputs["commandOnSuccess"];
        const failBuildOnError = inputs["failBuildOnError"];
        const failPluginOnError = inputs["failPluginOnError"];
        const skipPatterns = inputs["skipPatterns"];

        if (logAll)
        {
            const cacheKeyText = cacheKey === undefined ? "<undefined>" : cacheKey.length == 0 ? "<empty>" : '"' + cacheKey + '"';
            const cacheKeysText = Array.isArray(cacheKeys) ? cacheKeys.length == 1 ? "1 item" : cacheKeys.length + " items" : "no items";
            const envVarNameText = environmentVariableName === undefined ? "<undefined>" : environmentVariableName.length == 0 ? "<empty>" : '"' + environmentVariableName + '"';
            console.log("    commandOnError:    " + commandOnError);
            console.log("    commandOnSuccess:  " + commandOnSuccess);
            console.log("    failBuildOnError:  " + failBuildOnError);
            console.log("    failPluginOnError: " + failPluginOnError);
            console.log("    cacheKey:          " + cacheKeyText);
            console.log("    cacheKeys:         " + cacheKeysText);
            console.log("    envVarName:        " + envVarNameText);
            console.log("    skipPatterns:      " + skipPatterns);
            //console.log("    debug:             " + debug );
        }

        if (cacheKey)
        {
            if (environmentVariableName || cacheKeys)
                if (logAll) console.log("  cacheKey set. Ignoring environmentVariableName and cacheKeys.");
        }
        else
        {
            if (!environmentVariableName || !cacheKeys)
                return new UserConfig({error: "cacheKey not set, then cacheKeys and environmentVariableName must be set.", commandOnError, commandOnSuccess, failBuildOnError, failPluginOnError});

            const environmentVariableValue = process.env[environmentVariableName];
            if (!environmentVariableValue)
                return new UserConfig({error: 'Environment variable "' + environmentVariableName + '" not set.', commandOnError, commandOnSuccess, failBuildOnError, failPluginOnError});

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
                return new UserConfig({error: 'No cache key found for "' + environmentVariableValue + '" in ' + JSON.stringify(cacheKeys) + ".", commandOnError, commandOnSuccess, failBuildOnError, failPluginOnError});

            if (logAll) console.log('    Final cacheKey:    "' + cacheKey + '"');
        }

        return new UserConfig({commandOnError, commandOnSuccess, failBuildOnError, failPluginOnError, cacheKey, debug, skipPatterns});
    }
}
