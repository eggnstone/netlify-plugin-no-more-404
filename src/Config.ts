export class Config
{
    private _error?: string;

    public get error()
    {
        return this._error;
    }

    public static create(inputs: any): Config
    {
        const c = new Config();

        c._error = "TODO";

        return c;
    }
}
