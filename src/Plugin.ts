import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";
import {logGreen, logRed} from "./Log";

export class Plugin
{
    static async run(params: { systemConfig: SystemConfig, userConfig: UserConfig }): Promise<{ error?: string, missingPaths: string[] }>
    {
        try
        {
            if (!fs.existsSync(params.systemConfig.fullPublishDir))
                return {error: `Publish directory not found: ${params.systemConfig.fullPublishDir}`, missingPaths: []};

            const newCollection = await Collector.collect({startPath: params.systemConfig.fullPublishDir, currentPath: params.systemConfig.fullPublishDir});

            const store = new Store({path: params.systemConfig.fullCacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            const oldCollection = store.readAndGet(params.userConfig.cacheKey);
            //console.log("  oldCollection: " + JSON.stringify(oldCollection));

            if (!oldCollection)
            {
                logGreen("  No data from previous run found. Saving current data.");
                store.setAndWrite(params.userConfig.cacheKey, newCollection);
                //console.log("  Data saved.");
                return {error: undefined, missingPaths: []};
            }

            console.log("  Data from previous run found. Comparing with current data.");
            const missingPaths = [];
            for (let oldShortPath of oldCollection)
            {
                const oldFullPath = path.join(params.systemConfig.fullPublishDir, oldShortPath);
                if (!fs.existsSync(oldFullPath))
                {
                    logRed("  Missing: " + oldShortPath);
                    missingPaths.push(oldShortPath);
                }
            }

            if (missingPaths.length > 0)
                return {error: undefined, missingPaths: missingPaths};

            logGreen("  No missing paths found. We're good to go.");
            //console.log("  No missing paths found. Saving current data.");
            store.setAndWrite(params.userConfig.cacheKey, newCollection);
            //console.log("  Data saved.");

            return {error: undefined, missingPaths: []};
        }
        catch (e)
        {
            console.error(e);
            return {error: `${e}`, missingPaths: []};
        }
    }
}
