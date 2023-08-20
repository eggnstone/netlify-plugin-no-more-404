import {Plugin} from "../src/Plugin";
import * as path from "path";
import {UserConfig} from "../src/UserConfig";
import {SystemConfig} from "../src/SystemConfig";
import {RedirectConfig} from "../src/RedirectConfig";
import {Config} from "../src/Config";

describe("Plugin", function ()
{
    describe("run", function ()
    {
        it("'MainPageMissingButHasRedirect' should return no error and TODO.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirect", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([{"from": "/main.html", "to": "/main2.html"}]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual([]);
            expect(actual.redirectedPaths).toStrictEqual(["main.html"]);
        });
    });
});
