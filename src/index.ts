import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";
import {logBlue, logError, logGreen} from "./Log";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => check({data: data, complete: false});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => check({data: data, complete: true});

async function check(params: { data: any, complete: boolean }): Promise<void>
{
    logBlue("# eggnstone-netlify-plugin-no-more-404/check: START");

    if (params.complete)
        console.log("  Performing full check.");
    else
        console.log("  Performing preflight check only.");

    // noinspection JSUnresolvedReference
    const utilsBuild = params.data.utils.build;

    // noinspection JSUnresolvedReference
    //utilsBuild.failBuild("test");

    const systemConfig = SystemConfig.create(params.data.constants);
    if (systemConfig.error)
    {
        // noinspection JSUnresolvedReference
        utilsBuild.failBuild(systemConfig.error);
        return;
    }

    const userConfig = UserConfig.create(params.data.inputs);
    if (userConfig.error)
    {
        // noinspection JSUnresolvedReference
        utilsBuild.failBuild(userConfig.error);
        return;
    }

    if (!params.complete)
    {
        logGreen("  Preflight check OK. We're good to go.");
        logBlue("# eggnstone-netlify-plugin-no-more-404/check: END");
        return;
    }

    const result = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

    let error;
    if (result.error)
        error = result.error;
    else if (result.missingPaths.length > 0)
        error = result.missingPaths.length + " missing paths found.";

    if (error)
        logError("  " + error);

    logBlue("# eggnstone-netlify-plugin-no-more-404/check: END");

    if (!error)
        return

    if (userConfig.on404 === "warn")
    {
        // noinspection JSUnresolvedReference
        utilsBuild.failPlugin(error);
    }
    else
    {
        // noinspection JSUnresolvedReference
        utilsBuild.failBuild(error);
    }
}
