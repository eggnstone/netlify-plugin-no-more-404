import * as colors from "colors/safe";

export function logDemo()
{
    logDebug("Debug");
    logInfo("Info");
    logWarn("Warn");
    logError("Error");

    logRed("Red");
    logGreen("Green");
    logBlue("Blue");
}

export function logDebug(s: string)
{
    console.log(colors.green(s));
}

export function logInfo(s: string)
{
    console.log(colors.blue(s));
}

export function logWarn(s: string)
{
    console.log(colors.yellow(s));
}

export function logError(s: string)
{
    console.log(colors.red(s));
}

export function logRed(s: string)
{
    console.log(colors.red(s));
}

export function logGreen(s: string)
{
    console.log(colors.green(s));
}

export function logBlue(s: string)
{
    console.log(colors.blue(s));
}
