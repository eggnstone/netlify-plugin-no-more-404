import * as fs from "fs";
import * as path from "path";
import {Collector} from "./Collector";
import {Store} from "./Store";

export class Plugin
{
    static async run(params: { cacheDir: string; publishDir: string; cacheKey: string; }): Promise<{ error?: string, missingPaths: string[] }>
    {
        //console.log("# Plugin.run");

        const fullPublishDir = path.join(process.cwd(), params.publishDir);

        if (!params.cacheKey)
            return {error: "No cacheKey provided.", missingPaths: []};

        //console.log("  cacheDir:       " + cacheDir);
        //console.log("  publishDir:     " + publishDir);
        //console.log("  fullPublishDir: " + fullPublishDir);
        //console.log("  cacheKey:       " + cacheKey);

        try
        {
            const newCollection = await Collector.collect({startPath: fullPublishDir, currentPath: fullPublishDir});

            const store = new Store({cwd: params.cacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            //console.log("  store: " + JSON.stringify(store));

            const oldCollection = store.get(params.cacheKey) || [];
            //console.log("  oldCollection: " + JSON.stringify(oldCollection));

            if (!Array.isArray(oldCollection))
                return {error: "Error while trying to retrieve data from previous run. (not an array)", missingPaths: []};

            if (oldCollection.length === 0)
            {
                console.log("  No data from previous run found. Saving current data.");
                store.set(params.cacheKey, newCollection);
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
            store.set(params.cacheKey, newCollection);
            //console.log("  Data saved.");

            return {error: undefined, missingPaths: []};
        }
        catch (e)
        {
            return {error: `${e}`, missingPaths: []};
        }
    }
}
