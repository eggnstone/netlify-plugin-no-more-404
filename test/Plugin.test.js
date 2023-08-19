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

            await Plugin.run({cacheDir: cacheDir, publishDir: publishDir});
        });
    });
});
