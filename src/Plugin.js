import path from "path";
import {Collector} from "./Collector.js";
import Conf from "conf";
import fs from "fs";

export class Plugin
{
    static async run({cacheDir, publishDir, cacheKey})
    {
        //console.log("# Plugin.run");

        const fullPublishDir = path.join(process.cwd(), publishDir);

        if (!cacheKey)
            return {error: "No cacheKey provided.", missingPaths: []};

        //console.log("  cacheDir:       " + cacheDir);
        //console.log("  publishDir:     " + publishDir);
        //console.log("  fullPublishDir: " + fullPublishDir);
        //console.log("  cacheKey:       " + cacheKey);

        try
        {
            const newCollection = await Collector.collect({startPath: fullPublishDir, currentPath: fullPublishDir});

            const conf = new Conf({cwd: cacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            //console.log("  conf: " + JSON.stringify(conf));

            const oldCollection = conf.get(cacheKey) || [];
            //console.log("  oldCollection: " + JSON.stringify(oldCollection));

            if (!Array.isArray(oldCollection))
                return {error: "Error while trying to retrieve data from previous run. (not an array)", missingPaths: []};

            if (oldCollection.length === 0)
            {
                console.log("  No data from previous run found. Saving current data.");
                conf.set(cacheKey, newCollection);
                //console.log("  Data saved.");
                return {error: undefined, missingPaths: []};
            }

            console.log("  Data from previous run found. Comparing with current data.");
            const missingPaths = [];
            for (let oldShortPath of oldCollection)
            {
                const oldFullPath = path.join(fullPublishDir, oldShortPath, 'index.html');
                if (fs.existsSync(oldFullPath))
                {
                    //console.log("  OK: " + oldShortPath);
                }
                else
                {
                    if (oldShortPath.endsWith("\\"))
                    {
                        console.log("  Missing: " + oldShortPath);
                        missingPaths.push(oldShortPath);
                    }
                    else
                    {
                        const oldFullPath2 = path.join(fullPublishDir, oldShortPath) + '.html';
                        if (fs.existsSync(oldFullPath2))
                        {
                            //console.log("  OK: " + oldShortPath);
                        }
                        else
                        {
                            console.log("  Missing: " + oldShortPath);
                            missingPaths.push(oldShortPath);
                        }
                    }
                }
            }

            if (missingPaths.length > 0)
                return {error: undefined, missingPaths: missingPaths};

            console.log("  No missing paths found. We're good to go.");
            //console.log("  No missing paths found. Saving current data.");
            conf.set(cacheKey, newCollection);
            //console.log("  Data saved.");

            return {error: undefined, missingPaths: []};
        }
        catch (e)
        {
            return {error: e, missingPaths: []};
        }
    }
}
