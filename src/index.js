// noinspection JSUnusedGlobalSymbols

import {Plugin} from "./Plugin.js";

//export const onPreBuild = (data) => test(data);
export const onPostBuild = (data) => test(data);

async function test(data)
{
    console.log("# eggnstone-netlify-plugin-no-more-404: onPostBuild: START");

    const inputs = data.inputs;
    const constants = data.constants;
    const utils = data.utils;

    const cacheKeys = inputs.cacheKeys;
    //console.log("  cacheKeys: " + JSON.stringify(cacheKeys));

    const constantsCacheDir = constants.CACHE_DIR;
    const constantsPublishDir = constants.PUBLISH_DIR;

    const utilsBuild = utils.build;

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

    console.log("# eggnstone-netlify-plugin-no-more-404: onPostBuild: END");
}
