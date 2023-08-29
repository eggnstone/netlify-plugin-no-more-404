import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";
import {logGreen, logOrange, logRed} from "./Log";
import {Config} from "./Config";

export class Plugin
{
    static async run(config: Config, params: { logAll: boolean, write: boolean }): Promise<{ error?: string, missingPaths: string[], redirectedPaths: string[] }>
    {
        try
        {
            if (!fs.existsSync(config.systemConfig.fullPublishDir))
                return {error: `Publish directory not found: ${config.systemConfig.fullPublishDir}`, missingPaths: [], redirectedPaths: []};

            const newShortPaths = await Collector.collect({startPath: config.systemConfig.fullPublishDir, currentPath: config.systemConfig.fullPublishDir});

            const store = new Store({path: config.systemConfig.fullCacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            const oldShortPaths = store.readAndGet(config.userConfig.cacheKey);

            if (!oldShortPaths)
            {
                if (params.logAll) logGreen("  No data from previous run found. Saving current data.");
                if (params.write)
                    store.setAndWrite(config.userConfig.cacheKey, newShortPaths);

                return {error: undefined, missingPaths: [], redirectedPaths: []};
            }

            if (params.logAll) console.log("  Data from previous run found. Comparing with current data.");
            const missingShortPaths = [];
            for (let oldShortPath of oldShortPaths)
            {
                const oldFullPath = path.join(config.systemConfig.fullPublishDir, oldShortPath);
                if (!fs.existsSync(oldFullPath))
                {
                    if (params.logAll) logOrange("  Missing: " + oldShortPath);
                    missingShortPaths.push(oldShortPath);
                }
            }

            if (missingShortPaths.length == 0)
            {
                if (params.logAll) logGreen("  No paths missing. We're good to go.");
                if (params.write)
                    store.setAndWrite(config.userConfig.cacheKey, newShortPaths);

                return {error: undefined, missingPaths: [], redirectedPaths: []};
            }

            if (config.redirectConfig.redirects.length == 0)
                return {error: undefined, missingPaths: missingShortPaths, redirectedPaths: []};

            if (params.logAll) logOrange("  " + missingShortPaths.length + " paths missing (before applying redirects).");

            /*
            for (const redirect of config.redirectConfig.redirects)
            {
                const shortFrom = redirect["from"];
                const shortTo = redirect["to"];
                if (shortFrom.indexOf("*") >= 0)
                {
                    if (params.logAll) console.log("    Rule with * not handled yet: " + shortFrom + " -> " + shortTo);
                }
                else if (shortFrom.indexOf(":") >= 0)
                {
                    if (params.logAll) console.log("    Rule with : not handled yet: " + shortFrom + " -> " + shortTo);
                }
                else
                {
                    if (params.logAll) console.log("    Rule is OK:                  " + shortFrom + " -> " + shortTo);
                }
            }
            */

            const redirectedShortPaths = [];
            const stillMissingShortPaths = [];
            for (const missingShortPath of missingShortPaths)
            {
                //if (params.logAll) console.log("    missingShortPath:   " + missingShortPath);

                const missingShortPathNormalized = missingShortPath.replace(/\\/g, "/");
                if (params.logAll) console.log("    Missing:            /" + missingShortPathNormalized);

                let redirectFound = false;
                for (const redirect of config.redirectConfig.redirects)
                {
                    const fromShort = redirect["from"];
                    const toShort = redirect["to"];

                    if (fromShort.indexOf("*") >= 0 || fromShort.indexOf(":") >= 0)
                        continue;

                    let fromLong = fromShort;
                    //if (!fromLong.endsWith("/") && !fromLong.endsWith("\\") && !fromLong.endsWith(".html"))
                    if (fromLong.endsWith("/"))
                        fromLong += "index.html";

                    let toLong = toShort;
                    //if (!toLong.endsWith("/") && !toLong.endsWith("\\") && !toLong.endsWith(".html"))
                    if (toLong.endsWith("/"))
                        toLong += "index.html";

                    /*
                    if (params.logAll)
                    {
                        console.log("      fromShort:        " + fromShort);
                        console.log("      fromLong:         " + fromLong);
                        console.log("      toShort:          " + toShort);
                        console.log("      toLong:           " + toLong);
                    }
                    */

                    // TODO: * and :splat
                    if ("/" + missingShortPathNormalized == fromLong)
                    {
                        const redirectedFullPath = path.join(config.systemConfig.fullPublishDir, toLong);
                        //if (params.logAll) console.log("      Testing:          " + redirectedFullPath);
                        if (fs.existsSync(redirectedFullPath))
                        {
                            if (params.logAll) console.log("      Redirection OK:   " + toLong);
                            redirectFound = true;
                            break;
                        }

                        if (params.logAll) console.log("      Target not found: " + toLong);
                        // TODO: check redirect
                        // TODO: circular redirect
                    }
                }

                if (redirectFound)
                {
                    redirectedShortPaths.push(missingShortPath);
                }
                else
                {
                    if (params.logAll) console.log("      No working redirection found.");
                    stillMissingShortPaths.push(missingShortPath);
                }
            }

            if (stillMissingShortPaths.length == 0)
            {
                if (params.logAll) logGreen("  No paths missing (after applying redirects). We're good to go.");
                if (params.write)
                {
                    const combinedCollection = redirectedShortPaths.concat(newShortPaths);
                    store.setAndWrite(config.userConfig.cacheKey, combinedCollection);
                }

                return {error: undefined, missingPaths: [], redirectedPaths: redirectedShortPaths};
            }

            if (params.logAll) logRed("  " + stillMissingShortPaths.length + " paths missing (even after applying redirects).");

            return {error: undefined, missingPaths: stillMissingShortPaths, redirectedPaths: redirectedShortPaths};
        }
        catch (e)
        {
            if (params.logAll) console.error(e);
            return {error: `${e}`, missingPaths: [], redirectedPaths: []};
        }
    }
}
