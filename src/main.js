import path from "path";
import {Plugin} from "./Plugin.js";

(async () =>
{
    console.log("# MAIN START");

    const cacheDir = path.join("..", "..", ".netlify", "cache");
    const publishDir = path.join("..", "..", "dist");

    const cacheKey = "CACHE_KEY";

    const result = await Plugin.run({cacheDir: cacheDir, publishDir: publishDir, cacheKey: cacheKey});
    if (result)
        console.error(result);

    console.log("# MAIN END");
})();
