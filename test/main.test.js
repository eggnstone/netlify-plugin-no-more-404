const assert = require("assert");
const X = require("../src/X.js");

describe("X", function()
{
    describe("xxx", function()
    {
        it("should be xxx", function()
        {
            const x = new X();
            assert.equal(x.xxx(), "xxx");
        });
    });

    describe("y", function()
    {
        it("should be yyy", function()
        {
            assert.equal(X.yyy(), "yyy");
        });
    });
});
