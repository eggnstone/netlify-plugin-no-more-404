import * as fs from "fs";
import * as path from "path";

export class Store
{
    private readonly fullPath: string;

    private data: { [key: string]: string[] } = {};

    public constructor(params: { path: string, configName: string })
    {
        this.fullPath = path.join(params.path, params.configName) + ".json";
    }

    public read()
    {
        this.data = JSON.parse(fs.readFileSync(this.fullPath, "utf-8"));
        if (!this.data)
            throw new Error("Error while trying to read data from file: " + this.fullPath);
    }

    public write()
    {
        fs.writeFileSync(this.fullPath, JSON.stringify(this.data));
    }

    public get(cacheKey: string): string[]
    {
        return this.data[cacheKey];
    }

    public set(cacheKey: string, newCollection: string[])
    {
        this.data[cacheKey] = newCollection;
    }

    public readAndGet(cacheKey: string): string[]
    {
        this.read();
        return this.get(cacheKey);
    }

    public setAndWrite(cacheKey: string, newCollection: string[])
    {
        this.set(cacheKey, newCollection);
        this.write();
    }
}
