// noinspection JSUnusedGlobalSymbols

import {Plugin} from "./Plugin.js";
import {Config} from "./Config.js";

export const onPreBuild = (data) => check({data: data, complete: false});
export const onPostBuild = (data) => check({data: data, complete: true});

async function check({data, complete})
{
    console.log("# eggnstone-netlify-plugin-no-more-404/check: START");

    const inputs = data.inputs;
    const constants = data.constants;
    const utils = data.utils;

    const constantsCacheDir = constants.CACHE_DIR;
    const constantsPublishDir = constants.PUBLISH_DIR;

    const utilsBuild = utils.build;

    const config = Config.create(data.inputs);
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
