import assert from "assert";
import {Collector} from "../src/Collector.js";

describe("Collector", function()
{
    describe("collect", function()
    {
        it("should not return undefined", async function()
        {
            const startPath = process.cwd();
            const actual = await Collector.collect({startPath: startPath, currentPath: startPath});
            console.log("actual: " + JSON.stringify(actual));

            assert.notEqual(actual, undefined);
        });
    });
});
