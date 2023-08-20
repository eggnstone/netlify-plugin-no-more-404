import * as path from "path";
import {Plugin} from "./Plugin";
import {UserConfig} from "./UserConfig";
import {SystemConfig} from "./SystemConfig";
import {RedirectConfig} from "./RedirectConfig";
import {Config} from "./Config";

(async () =>
{
    console.log("# MAIN START");

    const cacheDir = path.join("..", "..", ".netlify", "cache");
    const publishDir = path.join("..", "..", "dist");
    const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
    if (systemConfig.error)
    {
        console.error(systemConfig.error);
        return;
    }

    const cacheKey = "CACHE_KEY";
    const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
    if (userConfig.error)
    {
        console.error(userConfig.error);
        return;
    }

    const redirectConfig = RedirectConfig.create({});
    expect(redirectConfig.error).toBeUndefined();

    const config = new Config({systemConfig: systemConfig, userConfig: userConfig, redirectConfig: redirectConfig});
    const result = await Plugin.run(config);
    if (result)
        console.error(result);

    console.log("# MAIN END");
})();
