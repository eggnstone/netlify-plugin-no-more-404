import path from "path";
import {Collector} from "./Collector.js";
import Conf from "conf";

export class Plugin
{
    static async run({cacheDir, publishDir})
    {
        console.log("  cacheDir:       " + cacheDir);
        console.log("  publishDir:     " + publishDir);

        const fullPublishDir = path.join(process.cwd(), publishDir);
        console.log("  fullPublishDir: " + fullPublishDir);

        try
        {
            const newCollection = await Collector.collect({startPath: fullPublishDir, currentPath: fullPublishDir});

            const conf = new Conf({cwd: cacheDir, configName: "eggnstone-netlify-plugin-no-more-404"});
            const oldCollection = conf.get("cacheKey") || [];
            if (oldCollection.length === 0)
            {
                console.log("  oldCollection FAIL");
                conf.set("cacheKey", newCollection);
            }
            else
            {
                console.log("  oldCollection OK");
            }

            return undefined;
        }
        catch (e)
        {
            return e;
        }
    }
}
