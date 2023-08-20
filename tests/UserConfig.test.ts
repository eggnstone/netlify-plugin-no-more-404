import {UserConfig} from "../src/UserConfig";

describe("userConfig", function ()
{
    it("Undefined inputs should give an error.", function ()
    {
        const userConfig = UserConfig.create(undefined);

        expect(userConfig.error).toBe("inputs not set.");
    });

    it("Missing on404 should give an error.", function ()
    {
        const inputs = {};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBe("on404 must be \"error\" or \"warn\".");
    });

    it("Missing cacheKey should an error.", function ()
    {
        const inputs = {on404: "error"};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKey should give no error.", function ()
    {
        const inputs = {on404: "error", cacheKey: "SomeCacheKey"};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBeUndefined();
    });

    it("Using environmentVariableName without cacheKeys should give an error.", function ()
    {
        const inputs = {on404: "error", environmentVariableName: "SomeVariableName"};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKeys without environmentVariableName should give an error.", function ()
    {
        const inputs = {on404: "error", cacheKeys: []};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("using an unset environmentVariable should give an error.", function ()
    {
        const inputs = {on404: "error", environmentVariableName: "SomeVariableName", cacheKeys: []};

        const userConfig = UserConfig.create(inputs);

        expect(userConfig.error).toBe("Environment variable \"SomeVariableName\" not set.");
    });
});