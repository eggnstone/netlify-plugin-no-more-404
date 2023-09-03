import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";
import {logGreen, logOrange, logRed} from "./Log";
import {Config} from "./Config";

const logDev = false;

export class Plugin
{
    static async run(config: Config, params: { logAll: boolean, write: boolean, isPreflight: boolean }): Promise<{ error?: string, missingPaths: string[], redirectedPaths: string[] }>
    {
        try
        {
            if (!fs.existsSync(config.systemConfig.fullPublishDir))
            {
                if (params.isPreflight)
                {
                    if (params.logAll) logGreen(`  Publish directory not found (that's OK in preflight): ${config.systemConfig.fullPublishDir}\n`); // Somehow we need a newline here, or otherwise it is not shown in the Netlify build log.
                    return {error: undefined, missingPaths: [], redirectedPaths: []};
                }

                return {error: `Publish directory not found: ${config.systemConfig.fullPublishDir}`, missingPaths: [], redirectedPaths: []};
            }

            const newShortPaths = await Collector.collect({startPath: config.systemConfig.fullPublishDir, currentPath: config.systemConfig.fullPublishDir});

            const store = new Store({path: config.systemConfig.fullCacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            const oldShortPaths = store.readAndGet(config.userConfig.cacheKey);

            if (!oldShortPaths)
            {
                if (params.write)
                {
                    if (params.logAll) logGreen("  No data from previous run found. => Nothing to check. Saving new data.");
                    store.setAndWrite(config.userConfig.cacheKey, newShortPaths);
                }
                else
                {
                    if (params.logAll) logGreen("  No data from previous run found. => Nothing to check.");
                }

                return {error: undefined, missingPaths: [], redirectedPaths: []};
            }

            if (params.logAll) console.log("  Data from previous run found. Comparing with current data.");
            const missingShortPaths = [];
            for (const oldShortPath of oldShortPaths)
            {
                const oldFullPath = path.join(config.systemConfig.fullPublishDir, oldShortPath);
                if (!fs.existsSync(oldFullPath))
                {
                    if (params.logAll) logOrange("    Missing: " + oldShortPath);
                    missingShortPaths.push(oldShortPath);
                }
            }

            if (missingShortPaths.length == 0)
            {
                if (params.write)
                {
                    if (params.logAll) logGreen("  No paths missing. Saving new data. We're good to go.\n"); // Somehow we need a newline here, or otherwise it is not shown in the Netlify build log.
                    store.setAndWrite(config.userConfig.cacheKey, newShortPaths);
                }
                else
                {
                    if (params.logAll) logGreen("  No paths missing. We're good to go.\n"); // Somehow we need a newline here, or otherwise it is not shown in the Netlify build log.
                }

                return {error: undefined, missingPaths: [], redirectedPaths: []};
            }

            if (config.redirectConfig.redirects.length == 0)
                return {error: undefined, missingPaths: missingShortPaths, redirectedPaths: []};

            if (params.logAll) logOrange("  " + missingShortPaths.length + " paths missing (before applying redirects).");

            for (const redirect of config.redirectConfig.redirects)
            {
                const shortFrom = redirect["from"];
                const shortTo = redirect["to"];
                if (logDev) console.log('    Rule: ' + shortFrom + " -> " + shortTo);

                if (shortFrom.indexOf(":") >= 0)
                {
                    if (params.logAll) console.log('    Rule with : in "from" not handled yet: ' + shortFrom + " -> " + shortTo);
                }
                else if (shortTo.replace(/:\/\//g, "").replace(/:splat/g, "").indexOf(":") >= 0)
                {
                    if (params.logAll) console.log('    Rule with : (other than :splat) in "to" not handled yet: ' + shortFrom + " -> " + shortTo);
                }
                else
                {
                    //if (params.logAll) console.log("    Rule is OK:                  " + shortFrom + " -> " + shortTo);
                }
            }

            const redirectedShortPaths = [];
            const stillMissingShortPaths = [];
            for (const missingShortPath of missingShortPaths)
            {
                //if (params.logAll) console.log("    missingShortPath:   " + missingShortPath);

                const missingShortPathNormalized = missingShortPath.replace(/\\/g, "/");
                const missingShortPathNormalizedWithLeadingSlash = "/" + missingShortPathNormalized;
                //if (params.logAll) console.log("    Missing:            " + missingShortPathNormalizedWithLeadingSlash);
                if (logDev) console.log("DEV: Missing: " + missingShortPathNormalizedWithLeadingSlash);

                let redirectFound = false;
                for (const redirect of config.redirectConfig.redirects)
                {
                    const fromShort = redirect["from"];
                    const toShort = redirect["to"];

                    if (fromShort.indexOf(":") >= 0)
                        continue;

                    let fromShortWithIndexHtml = fromShort;
                    //if (!fromShortWithIndexHtml.endsWith("/") && !fromShortWithIndexHtml.endsWith("\\") && !fromShortWithIndexHtml.endsWith(".html"))
                    if (fromShortWithIndexHtml.endsWith("/"))
                        fromShortWithIndexHtml += "index.html";

                    let toShortWithIndexHtml = toShort;
                    //if (!toShortWithIndexHtml.endsWith("/") && !toShortWithIndexHtml.endsWith("\\") && !toShortWithIndexHtml.endsWith(".html"))
                    if (toShortWithIndexHtml.endsWith("/"))
                        toShortWithIndexHtml += "index.html";

                    let redirectedShortPath;
                    const fromShortWildcardPos = fromShort.indexOf("*");
                    if (fromShortWildcardPos >= 0)
                    {
                        if (fromShortWildcardPos != fromShort.length - 1)
                        {
                            console.error('    Rule with * wildcard: "from" must end with * wildcard: ' + fromShort + " -> " + toShort);
                            continue;
                        }

                        const fromWithoutWildcard = fromShort.substring(0, fromShortWildcardPos);
                        if (logDev) console.log("DEV: fromShort: " + fromShort);
                        if (logDev) console.log("DEV: fromWithoutWildcard: " + fromWithoutWildcard);

                        if (!missingShortPathNormalizedWithLeadingSlash.startsWith(fromWithoutWildcard))
                            continue;

                        const splat = missingShortPathNormalizedWithLeadingSlash.substring(fromShortWildcardPos);
                        if (logDev) console.log("DEV: splat: " + splat);

                        const toShortSplatPos = toShort.indexOf(":splat");
                        if (toShortSplatPos >= 0)
                        {
                            if (logDev) console.log("DEV: toShortSplatPos: " + toShortSplatPos);

                            // noinspection UnnecessaryLocalVariableJS
                            const toShortWithSplat = toShort.replace(":splat", splat);
                            if (logDev) console.log("DEV: toShortWithSplat: " + toShortWithSplat);

                            let toShortWithIndexHtmlAndSplat = toShortWithSplat;
                            if (toShortWithIndexHtmlAndSplat.endsWith("/"))
                                toShortWithIndexHtmlAndSplat += "index.html";
                            if (logDev) console.log("DEV: toShortWithIndexHtmlAndSplat: " + toShortWithIndexHtmlAndSplat);

                            redirectedShortPath = toShortWithIndexHtmlAndSplat;
                        }
                        else
                        {
                            redirectedShortPath = toShortWithIndexHtml;
                        }
                    }
                    else if (missingShortPathNormalizedWithLeadingSlash == fromShortWithIndexHtml)
                    {
                        redirectedShortPath = toShortWithIndexHtml;
                    }

                    if (!redirectedShortPath)
                        continue;

                    const redirectedFullPath = path.join(config.systemConfig.fullPublishDir, redirectedShortPath);
                    if (logDev) console.log("DEV: Testing: " + redirectedFullPath);
                    if (fs.existsSync(redirectedFullPath))
                    {
                        if (logDev) console.log("DEV: Redirection OK: " + redirectedShortPath);
                        redirectFound = true;
                        break;
                    }

                    if (logDev) console.log("DEV: Target not found: " + redirectedShortPath);
                    if (params.logAll) console.log("    Redirection target not found: " + redirectedShortPath);
                    // TODO: check redirect
                    // TODO: circular redirect
                }

                if (redirectFound)
                {
                    redirectedShortPaths.push(missingShortPath);
                }
                else
                {
                    if (params.logAll) console.log("    Still not found: " + missingShortPathNormalizedWithLeadingSlash);
                    stillMissingShortPaths.push(missingShortPath);
                }
            }

            if (stillMissingShortPaths.length == 0)
            {
                if (params.write)
                {
                    if (params.logAll) logGreen("  No paths missing (after applying redirects). Saving new data. We're good to go.");
                    const combinedCollection = redirectedShortPaths.concat(newShortPaths);
                    store.setAndWrite(config.userConfig.cacheKey, combinedCollection);
                }
                else
                {
                    if (params.logAll) logGreen("  No paths missing (after applying redirects). We're good to go.");
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
