import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => check({data: data, complete: false});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => check({data: data, complete: true});

async function check(params: { data: any, complete: boolean }): Promise<void>
{
    console.log("# eggnstone-netlify-plugin-no-more-404/check: START");

    if (!params.complete)
        console.log("  Preflight check only.");

    // noinspection JSUnresolvedReference
    const utilsBuild = params.data.utils.build;

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

    const result = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

    if (result.error)
    {
        if (userConfig.on404 === "warn")
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failPlugin(result.error);
        }
        else
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(result.error);
        }
    }

    if (result.missingPaths.length > 0)
        if (userConfig.on404 === "warn")
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failPlugin(result.missingPaths.length + " missing paths found.");
        }
        else
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(result.missingPaths.length + " missing paths found.");
        }

    console.log("# eggnstone-netlify-plugin-no-more-404/check: END");
}
