import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";
import {logBlue, logError, logGreen, logInfo} from "./Log";
import {RedirectConfig} from "./RedirectConfig";
import {Config} from "./Config";
import * as child_process from "node:child_process";

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
        const result = await Plugin.run(config, {logAll: true, write: !params.isPreflight, isPreflight: params.isPreflight, skipPatterns: userConfig.skipPatterns});

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
        {
            if (userConfig.commandOnSuccess)
            {
                logInfo("  CommandOnSuccess: " + userConfig.commandOnSuccess);
                let command = userConfig.commandOnSuccess;
                command = command.replace(/%ENVIRONMENT_VARIABLE_NAME%/g, userConfig.environmentVariableName);
                command = command.replace(/%ENVIRONMENT_VARIABLE_VALUE%/g, userConfig.environmentVariableValue);
                command = command.replace(/%ERROR_TEXT%/g, "No error. All good.");
                logInfo("  Executing command: " + command);
                child_process.execSync(command);
            }

            return;
        }

        if (userConfig.commandOnError)
        {
            logInfo("  CommandOnError: " + userConfig.commandOnError);
            let command = userConfig.commandOnError;
            command = command.replace(/%ENVIRONMENT_VARIABLE_NAME%/g, userConfig.environmentVariableName);
            command = command.replace(/%ENVIRONMENT_VARIABLE_VALUE%/g, userConfig.environmentVariableValue);
            command = command.replace(/%ERROR_TEXT%/g, error);
            logInfo("  Executing command: " + command);
            child_process.execSync(command);
        }

        if (userConfig.failBuildOnError)
        {
            logInfo("  Failing build.");
            // noinspection JSUnresolvedReference
            utilsBuild.failBuild(error);
        }
        else if (userConfig.failPluginOnError)
        {
            logInfo("  Failing plugin.");
            // noinspection JSUnresolvedReference
            utilsBuild.failPlugin(error);
        }
    }
}
