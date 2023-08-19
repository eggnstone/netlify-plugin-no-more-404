// noinspection JSUnusedGlobalSymbols

import {Plugin} from "../src/Plugin.js";

export const onPreBuild = async function(data)
{
    console.log("# eggnstone-netlify-plugin-no-more-404: onPreBuild: START");

    const constants = data.constants;

    const constantsCacheDir = constants.CACHE_DIR;
    const constantsPublishDir = constants.PUBLISH_DIR;

    console.log("  constantsCacheDir:   " + constantsCacheDir);
    console.log("  constantsPublishDir: " + constantsPublishDir);

    console.log("# eggnstone-netlify-plugin-no-more-404: onPreBuild: END");
};

export const onPostBuild = async function(data)
{
    console.log("# eggnstone-netlify-plugin-no-more-404: onPostBuild: START");

    //const inputs = data.inputs;
    const constants = data.constants;
    const utils = data.utils;

    const constantsCacheDir = constants.CACHE_DIR;
    const constantsPublishDir = constants.PUBLISH_DIR;
    const utilsBuild = utils.build;

    const result = await Plugin.run({cacheDir: constantsCacheDir, publishDir: constantsPublishDir});
    if (result)
        utilsBuild.failBuild(result);

    console.log("# eggnstone-netlify-plugin-no-more-404: onPostBuild: END");
};
