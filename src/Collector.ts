import * as fs from "fs";
import * as path from "path";

export class Collector
{
    static async collect(params: { startPath: string; currentPath: string; }): Promise<string[]>
    {
        const collection = [];

        const filenames = fs.readdirSync(params.currentPath);
        for (const filename of filenames)
        {
            const newPath = path.join(params.currentPath, filename);
            if (fs.statSync(newPath).isDirectory())
            {
                const newCollection = await Collector.collect({startPath: params.startPath, currentPath: newPath});
                collection.push(...newCollection);
            }

            if (!newPath.endsWith(".html"))
                continue;

            let shortPath = path.relative(params.startPath, newPath);
            if (shortPath.endsWith("index.html"))
                shortPath = shortPath.slice(0, -10);
            else
                shortPath = shortPath.slice(0, -5);

            collection.push(shortPath);
        }

        return collection;
    }
}
