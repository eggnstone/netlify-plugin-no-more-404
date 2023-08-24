import {Plugin} from "../src/Plugin";
import * as path from "path";
import {UserConfig} from "../src/UserConfig";
import {SystemConfig} from "../src/SystemConfig";
import * as assert from "assert";
import {RedirectConfig} from "../src/RedirectConfig";
import {Config} from "../src/Config";

describe("Plugin", function ()
{
    describe("run", function ()
    {
        it("Missing cache file should return an error.", async function ()
        {
            const cacheDir = path.join("tests", "data", "missing-cache-path");
            const publishDir = path.join("tests", "data", "AllOk", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            assert(actual.error);
            expect(actual.error.startsWith("Error: Path not found: ")).toBeTruthy();
            expect(actual.error.endsWith("\\@eggnstone-netlify-plugin-no-more-404\\tests\\data\\missing-cache-path")).toBeTruthy();
        });

        it("'AllOk' should return no error and empty missing-list.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "AllOk", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual([]);
        });

        it("'MainPageMissing' should return no error and missing-list with main.html.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["main.html"]);
        });

        it("'MainIndexPageMissing' should return no error and missing-list with index.html.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainIndexPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["index.html"]);
        });

        it("'SubPageMissing' should return no error and missing-list with sub/sub.html.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "SubPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["sub\\sub.html"]);
        });

        it("'SubIndexPageMissing' should return no error and missing-list with sub/index.html.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "SubIndexPageMissing", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["sub\\index.html"]);
        });
    });
});
