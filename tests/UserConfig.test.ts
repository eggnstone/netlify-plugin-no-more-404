import {UserConfig} from "../src/UserConfig";
import * as assert from "assert";
import 'jest-expect-message';

describe("userConfig", function ()
{
    it("Undefined inputs should return an error.", function ()
    {
        const actual = UserConfig.create(undefined, false);

        expect(actual.error).toBe("inputs not set.");
    });

    it("Missing failBuildOnError should return an error.", function ()
    {
        const inputs = {};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBe("failBuildOnError must be true or false.");
    });

    it("Missing cacheKey should an error.", function ()
    {
        const inputs = {failBuildOnError: true};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKey should return no error.", function ()
    {
        const inputs = {failBuildOnError: true, cacheKey: "SomeCacheKey"};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBeUndefined();
    });

    it("Using environmentVariableName without cacheKeys should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, environmentVariableName: "SomeVariableName"};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("Using cacheKeys without environmentVariableName should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, cacheKeys: []};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBe("cacheKey not set, then cacheKeys and environmentVariableName must be set.");
    });

    it("using an unset environmentVariable should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, environmentVariableName: "SomeVariableName", cacheKeys: []};

        const actual = UserConfig.create(inputs, false);

        expect(actual.error).toBe('Environment variable "SomeVariableName" not set.');
    });

    it("using a set environmentVariable which does not match any of the cacheKeys should return an error.", function ()
    {
        const inputs = {failBuildOnError: true, environmentVariableName: "ComputerName", cacheKeys: []};

        const actual = UserConfig.create(inputs, false);

        assert(actual.error);
        expect(actual.error.startsWith('No cache key found for "'), 'Is: "' + actual.error + '"').toBeTruthy();
        expect(actual.error.endsWith('" in [].'), 'Is: "' + actual.error + '"').toBeTruthy();
    });
});
