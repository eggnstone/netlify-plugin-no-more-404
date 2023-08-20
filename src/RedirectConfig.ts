export class RedirectConfig
{
    public readonly error?: string;
    public readonly redirects: any[];

    private constructor(params: {
        error?: string,
        redirects: any[];
    })
    {
        this.error = params.error;
        this.redirects = params.redirects;
    }

    public static create(redirects: any[]): RedirectConfig
    {
        // "redirects":[{"from":"/blog/category/*","query":{},"to":"/blog-category/:splat","force":false,"conditions":{},"headers":{}}]}

        return new RedirectConfig({redirects});
    }
}
