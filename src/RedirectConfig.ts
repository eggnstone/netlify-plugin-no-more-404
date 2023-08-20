export class RedirectConfig
{
    public readonly error?: string;
    public readonly redirects: { [key: string]: string[] };

    private constructor(params: {
        error?: string,
        redirects: { [key: string]: string[] };
    })
    {
        this.error = params.error;
        this.redirects = params.redirects;
    }

    public static create(redirects: any): RedirectConfig
    {
        // "redirects":[{"from":"/blog/category/*","query":{},"to":"/blog-category/:splat","force":false,"conditions":{},"headers":{}}]}

        return new RedirectConfig({redirects: redirects});
    }
}
