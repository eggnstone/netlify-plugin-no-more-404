import {Collector} from "../src/Collector";
import * as path from "path";

describe("Collector", function ()
{
    describe("collect", function ()
    {
        it("'AllOk' should return non-empty array of paths.", async function ()
        {
            const startPath = path.join(process.cwd(), "tests", "AllOk", "dist");

            const actual: any[] = await Collector.collect({startPath: startPath, currentPath: startPath});

            expect(actual).toStrictEqual(["main-page", "sub\\sub-page"]);
        });
    });
});
