import {promisify} from "util";
import fs from "fs";
import path from "path";

const readDir = promisify(fs.readdir);

export class Collector
{
    static async collect({startPath, currentPath})
    {
        const collection = [];

        const filenames = await readDir(currentPath);
        for (const filename of filenames)
        {
            const newPath = path.join(currentPath, filename);
            if (fs.statSync(newPath).isDirectory())
            {
                const newCollection = await Collector.collect({startPath: startPath, currentPath: newPath});
                collection.push(...newCollection);
            }
            else if (newPath.endsWith(".html"))
            {
                let shortPath = path.relative(startPath, newPath);
                if (shortPath.endsWith("index.html"))
                    shortPath = shortPath.slice(0, -10);
                else
                    shortPath = shortPath.slice(0, -5);

                collection.push(shortPath);
            }
        }

        return collection;
    }
}
