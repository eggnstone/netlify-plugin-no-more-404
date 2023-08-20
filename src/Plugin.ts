import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";
import {logGreen, logRed} from "./Log";
import {Config} from "./Config";

export class Plugin
{
    static async run(config: Config): Promise<{ error?: string, missingPaths: string[] }>
    {
        try
        {
            if (!fs.existsSync(config.systemConfig.fullPublishDir))
                return {error: `Publish directory not found: ${config.systemConfig.fullPublishDir}`, missingPaths: []};

            const newCollection = await Collector.collect({startPath: config.systemConfig.fullPublishDir, currentPath: config.systemConfig.fullPublishDir});

            const store = new Store({path: config.systemConfig.fullCacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            const oldCollection = store.readAndGet(config.userConfig.cacheKey);
            //console.log("  oldCollection: " + JSON.stringify(oldCollection));

            if (!oldCollection)
            {
                logGreen("  No data from previous run found. Saving current data.");
                store.setAndWrite(config.userConfig.cacheKey, newCollection);
                //console.log("  Data saved.");
                return {error: undefined, missingPaths: []};
            }

            console.log("  Data from previous run found. Comparing with current data.");
            const missingPaths = [];
            for (let oldShortPath of oldCollection)
            {
                const oldFullPath = path.join(config.systemConfig.fullPublishDir, oldShortPath);
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
            store.setAndWrite(config.userConfig.cacheKey, newCollection);
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
