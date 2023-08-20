import {Plugin} from "../src/Plugin.js";
import path from "path";

describe("Plugin", function()
{
    describe("run", function()
    {
        it("'AllOk' should return no error and empty missing-list.", async function()
        {
            const cacheDir = path.join("test", "AllOk", "cache");
            const publishDir = path.join("test", "AllOk", "dist");
            const cacheKey = "MainPageAndSubPage";

            const actual = await Plugin.run({cacheDir: cacheDir, publishDir: publishDir, cacheKey: cacheKey});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths.length).toBe(0);
        });

        it("'MainPageMissing' should return error and missing-list with main-page.", async function()
        {
            const cacheDir = path.join("test", "MainPageMissing", "cache");
            const publishDir = path.join("test", "MainPageMissing", "dist");
            const cacheKey = "MainPageAndSubPage";

            const actual = await Plugin.run({cacheDir: cacheDir, publishDir: publishDir, cacheKey: cacheKey});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["main-page"]);
        });

        it("'SubPageMissing' should return error and missing-list with sub/sub-page.", async function()
        {
            const cacheDir = path.join("test", "SubPageMissing", "cache");
            const publishDir = path.join("test", "SubPageMissing", "dist");
            const cacheKey = "MainPageAndSubPage";

            const actual = await Plugin.run({cacheDir: cacheDir, publishDir: publishDir, cacheKey: cacheKey});

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths).toStrictEqual(["sub\\sub-page"]);
        });
    });
});
