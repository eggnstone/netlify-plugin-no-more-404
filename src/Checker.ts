import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";
import {logBlue, logError, logGreen} from "./Log";
import {RedirectConfig} from "./RedirectConfig";
import {Config} from "./Config";

export class Checker
{
    static async check(params: { data: any, isPreflight: boolean }): Promise<void>
    {
        logBlue("# eggnstone-netlify-plugin-no-more-404 START");

        if (params.isPreflight)
            console.log("  Performing preflight check only.");
        else
            console.log("  Performing full check.");

        // noinspection JSUnresolvedReference
        const utilsBuild = params.data.utils.build;

        const systemConfig = SystemConfig.create(params.data.constants, true);
        if (systemConfig.error)
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(systemConfig.error);
            return;
        }

        const userConfig = UserConfig.create(params.data.inputs, true);
        if (userConfig.error)
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(userConfig.error);
            return;
        }

        //console.log("    redirects:                " + JSON.stringify(params.data["netlifyConfig"]["redirects"]));
        const redirectConfig = RedirectConfig.create(params.data["netlifyConfig"]["redirects"]);
        if (redirectConfig.error)
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(redirectConfig.error);
            return;
        }

        // TODO: check rules

        if (params.isPreflight)
        {
            logGreen("  Preflight check OK. We're good to go.\n"); // Somehow we need a newline here, or otherwise it is not shown in the Netlify build log.
            logBlue("# eggnstone-netlify-plugin-no-more-404 END");
            return;
        }

        const config = new Config({systemConfig, userConfig, redirectConfig});
        const result = await Plugin.run(config, {logAll: true, write: !params.isPreflight, isPreflight: params.isPreflight});

        let error;
        if (result.error)
        {
            error = result.error;
            logError("  " + error);
        }
        else if (result.missingPaths.length > 0)
        {
            error = result.missingPaths.length + " paths missing.";
        }

        logBlue("# eggnstone-netlify-plugin-no-more-404 END");

        if (!error)
            return;

        if (userConfig.failBuildOnError)
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(error);
        }
        else
        {
            // noinspection JSUnresolvedReference
            utilsBuild.failPlugin(error);
        }
    }
}
