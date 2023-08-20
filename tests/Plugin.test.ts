import {Plugin} from "../src/Plugin";
import * as path from "path";
import {UserConfig} from "../src/UserConfig";
import {SystemConfig} from "../src/SystemConfig";

describe("Plugin", function ()
{
    describe("run", function ()
    {
        it("'AllOk' should return no error and empty missing-list.", async function ()
        {
            const cacheDir = path.join("tests", "cache");
            const publishDir = path.join("tests", "AllOk", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths.length).toBe(0);
        });

        it("'MainPageMissing' should return error and missing-list with main.html.", async function ()
        {
            const cacheDir = path.join("tests", "cache");
            const publishDir = path.join("tests", "MainPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["main.html"]);
        });

        it("'MainIndexPageMissing' should return error and missing-list with index.html.", async function ()
        {
            const cacheDir = path.join("tests", "cache");
            const publishDir = path.join("tests", "MainIndexPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["index.html"]);
        });

        it("'SubPageMissing' should return error and missing-list with sub/sub.html.", async function ()
        {
            const cacheDir = path.join("tests", "cache");
            const publishDir = path.join("tests", "SubPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["sub\\sub.html"]);
        });

        it("'SubIndexPageMissing' should return error and missing-list with sub/index.html.", async function ()
        {
            const cacheDir = path.join("tests", "cache");
            const publishDir = path.join("tests", "SubIndexPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir});
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({on404: "error", cacheKey: cacheKey});
            expect(userConfig.error).toBeUndefined();

            const actual = await Plugin.run({systemConfig: systemConfig, userConfig: userConfig});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["sub\\index.html"]);
        });
    });
});