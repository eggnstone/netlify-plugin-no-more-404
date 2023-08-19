import {Plugin} from "../src/Plugin.js";
import path from "path";

describe("Plugin", function()
{
    describe("run", function()
    {
        it("TODO", async function()
        {
            const cacheDir = path.join("test", "cache");
            const publishDir = path.join("test", "dist");

            const actual = await Plugin.run({cacheDir: cacheDir, publishDir: publishDir});
            console.log("error: " + JSON.stringify(actual.error));
            console.log("missingPaths: " + JSON.stringify(actual.missingPaths));

            expect(actual.error).toBeUndefined();
            expect(actual.missingPaths.length).toBe(0);
            //expect(actual.missingPaths.length).toStrictEqual([]);
        });
    });
});
