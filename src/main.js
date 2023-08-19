import {Collector} from "./Collector.js";
import path from "path";

(async () =>
{
    console.log("# MAIN START");

    const startPath = path.join(process.cwd(), "..", "..", "dist");
    const collection = await Collector.collect({startPath: startPath, currentPath: startPath});
    console.log("collection: " + JSON.stringify(collection, null, 4));

    console.log("# MAIN END");
})();
