import {Plugin} from "../src/Plugin";
import * as path from "path";
import {UserConfig} from "../src/UserConfig";
import {SystemConfig} from "../src/SystemConfig";

describe("Plugin", function ()
{
    describe("run", function ()
    {
        it("'MainPageMissingButHasRedirect' should return no error and TODO.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirect", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            //TODO expect(actual.missingPaths).toStrictEqual([]);
        });
    });
});
