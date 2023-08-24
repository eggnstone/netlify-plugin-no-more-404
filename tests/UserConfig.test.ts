import {UserConfig} from "../src/UserConfig";

describe("userConfig", function ()
{
    it("Undefined inputs should return an error.", function ()
    {
        const userConfig = UserConfig.create(undefined, false);

        expect(userConfig.error).toBe("inputs not set.");
    });

    it("Missing failBuildOnError should return an error.", function ()
    {
        const inputs = {};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBe("failBuildOnError must be true or false.");
    });

    it("Missing cacheKey should an error.", function ()
    {
        const inputs = {failBuildOnError: true};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKey should return no error.", function ()
    {
        const inputs = {failBuildOnError: true, cacheKey: "SomeCacheKey"};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBeUndefined();
    });

    it("Using environmentVariableName without cacheKeys should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, environmentVariableName: "SomeVariableName"};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKeys without environmentVariableName should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, cacheKeys: []};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("using an unset environmentVariable should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, environmentVariableName: "SomeVariableName", cacheKeys: []};

        const userConfig = UserConfig.create(inputs, false);

        expect(userConfig.error).toBe("Environment variable \"SomeVariableName\" not set.");
    });
});
