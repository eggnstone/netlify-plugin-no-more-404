import * as path from "path";
import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";

(async () =>
{
    console.log("# MAIN START");

    const cacheDir = path.join("..", "..", ".netlify", "cache");
    const publishDir = path.join("..", "..", "dist");
    const systemConfig = SystemConfig.create({constants: {CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}});
    if (systemConfig.error)
    {
        console.error(systemConfig.error);
        return;
    }

    const cacheKey = "CACHE_KEY";
    const userConfig = UserConfig.create({inputs: {on404: "error", cacheKey: cacheKey}});
    if (userConfig.error)
    {
        console.error(userConfig.error);
        return;
    }

    const result = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});
    if (result)
        console.error(result);

    console.log("# MAIN END");
})();
