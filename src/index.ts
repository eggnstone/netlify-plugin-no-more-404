import {Plugin} from "./Plugin";
import {Config} from "./Config";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => check({data: data, complete: false});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => check({data: data, complete: true});

async function check(params: { data: any; complete: boolean; }): Promise<void>
{
    console.log("# eggnstone-netlify-plugin-no-more-404/check: START");

    if (!params.complete)
        console.log("  Preflight check only.");

    const inputs = params.data.inputs;
    const constants = params.data.constants;
    const utils = params.data.utils;

    const constantsCacheDir = constants.CACHE_DIR;
    const constantsPublishDir = constants.PUBLISH_DIR;

    const utilsBuild = utils.build;

    const config = Config.create(params.data.inputs);
    if (config.error)
    {
        utilsBuild.failBuild(config.error);
        return;
    }

    const cacheKeys = inputs.cacheKeys;
    //console.log("  cacheKeys: " + JSON.stringify(cacheKeys));

    const configName = process.env.CONFIG_NAME;
    //console.log("  configName: " + configName);

    if (!configName)
    {
        utilsBuild.failBuild("CONFIG_NAME environment variable not set.");
        return;
    }

    let cacheKey;
    let key;
    for (key of cacheKeys)
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

    //console.log("  CacheKey found: " + cacheKey);

    const result = await Plugin.run({cacheDir: constantsCacheDir, publishDir: constantsPublishDir, cacheKey: cacheKey});

    if (result.error)
        utilsBuild.failBuild(result.error);

    if (result.missingPaths.length > 0)
        utilsBuild.failBuild(result.missingPaths.length + " missing paths found.");

    console.log("# eggnstone-netlify-plugin-no-more-404/check: END");
}
