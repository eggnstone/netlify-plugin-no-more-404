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
        it("'MainPageMissingButHasRedirect' should return no error / old path in redirectedPaths list.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirect", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([{"from": "/main.html", "to": "/main2.html"}]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false, isPreflight: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual([]);
            expect(actual.redirectedPaths).toStrictEqual(["main.html"]);
        });

        /*
        it("'MainPageMissingButHasRedirect' with * wildcard and text after * wildcard should return error.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirect", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([{"from": "/*ABC", "to": "/main2.html"}]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false, isPreflight: false});

            assert(actual.error);
            expect(actual.error.startsWith("abc")).toBeTruthy();
            expect(actual.error.endsWith("def")).toBeTruthy();
        });
        */

        it("'MainPageMissingButHasRedirect' with wildcard should return no error / old path in redirectedPaths list.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirect", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([{"from": "/*", "to": "/main2.html"}]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false, isPreflight: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual([]);
            expect(actual.redirectedPaths).toStrictEqual(["main.html"]);
        });

        it("'MainPageMissingButHasRedirectWithSplat' with wildcard and wildcard should return no error / old path in redirectedPaths list.", async function ()
        {
            const cacheDir = path.join("tests", "data", "cache");
            const publishDir = path.join("tests", "data", "MainPageMissingButHasRedirectWithSplat", "dist");
            const systemConfig = SystemConfig.create({CACHE_DIR: cacheDir, PUBLISH_DIR: publishDir}, false);
            expect(systemConfig.error).toBeUndefined();

            const cacheKey = "MainPageAndSubPage";
            const userConfig = UserConfig.create({failBuildOnError: true, cacheKey}, false);
            expect(userConfig.error).toBeUndefined();

            const redirectConfig = RedirectConfig.create([{"from": "/*", "to": "/new-:splat"}]);
            expect(redirectConfig.error).toBeUndefined();

            const config = new Config({systemConfig, userConfig, redirectConfig});
            const actual = await Plugin.run(config, {logAll: false, write: false, isPreflight: false});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual([]);
            expect(actual.redirectedPaths).toStrictEqual(["main.html"]);
        });
    });
});
