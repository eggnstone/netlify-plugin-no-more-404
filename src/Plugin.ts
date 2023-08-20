import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";
import {logGreen, logRed} from "./Log";
import {Config} from "./Config";

export class Plugin
{
    static async run(config: Config, params: { logAll: boolean, write: boolean }): Promise<{ error?: string, missingPaths: string[] }>
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
                if (params.logAll) logGreen("  No data from previous run found. Saving current data.");
                if (params.write)
                    store.setAndWrite(config.userConfig.cacheKey, newCollection);

                return {error: undefined, missingPaths: []};
            }

            if (params.logAll) console.log("  Data from previous run found. Comparing with current data.");
            const missingShortPaths = [];
            for (let oldShortPath of oldCollection)
            {
                const oldFullPath = path.join(config.systemConfig.fullPublishDir, oldShortPath);
                if (!fs.existsSync(oldFullPath))
                {
                    if (params.logAll) logRed("  Missing: " + oldShortPath);
                    missingShortPaths.push(oldShortPath);
                }
            }

            if (missingShortPaths.length == 0)
            {
                if (params.logAll) logGreen("  No paths missing. We're good to go.");
                if (params.write)
                    store.setAndWrite(config.userConfig.cacheKey, newCollection);

                return {error: undefined, missingPaths: []};
            }

            if (config.redirectConfig.redirects.length == 0)
                return {error: undefined, missingPaths: missingShortPaths};

            if (params.logAll) logRed("  " + missingShortPaths.length + " paths missing.");

            const stillMissingShortPaths = [];
            //for (let missingShortPathIndex = missingShortPaths.length - 1; missingShortPathIndex >= 0; missingShortPathIndex--)
            for (const missingShortPath of missingShortPaths)
            {
                let redirectFound = false;
                for (const redirect of config.redirectConfig.redirects)
                {
                    const from = redirect["from"];
                    const to = redirect["to"];
                    console.log("Testing redirect: " + from + " -> " + to + " for missing path: " + missingShortPath);
                    if (missingShortPath == from)
                    {
                        const redirectedFullPath = path.join(config.systemConfig.fullPublishDir, to);
                        if (fs.existsSync(redirectedFullPath))
                        {
                            if (params.logAll) console.log("  Redirected: " + missingShortPath + " -> " + to);
                            redirectFound = true;
                            break;
                        }
                    }
                }

                if (!redirectFound)
                    stillMissingShortPaths.push(missingShortPath);
            }

            if (stillMissingShortPaths.length == 0)
            {
                if (params.logAll) logGreen("  No paths missing (after applying redirects). We're good to go.");
                if (params.write)
                    store.setAndWrite(config.userConfig.cacheKey, newCollection);

                return {error: undefined, missingPaths: []};
            }

            if (params.logAll) logRed("  " + stillMissingShortPaths.length + " paths missing (even after applying redirects).");

            return {error: undefined, missingPaths: missingShortPaths};
        }
        catch (e)
        {
            if (params.logAll) console.error(e);
            return {error: `${e}`, missingPaths: []};
        }
    }
}
