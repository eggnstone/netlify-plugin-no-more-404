// noinspection JSUnusedGlobalSymbols

const X = require("./X.js");

module.exports = {
    onPreBuild: (x) =>
    {
        console.log("netlify-plugin-no-more-404-eggnstone: onPreBuild");
        //console.log("netlify-plugin-no-more-404-eggnstone: onPreBuild: " + JSON.stringify(x));

        const xx = new X();
        console.log(xx.xxx());
    },
    onPostBuild: (x) =>
    {
        console.log("netlify-plugin-no-more-404-eggnstone: onPostBuild");
        //console.log("netlify-plugin-no-more-404-eggnstone: onPostBuild: " + JSON.stringify(x));

        const xx = new X();
        console.log(xx.xxx());
    }
};
