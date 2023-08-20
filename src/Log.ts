const COLOR_DEBUG = '\x1B[38:2:48:141:108m';
const COLOR_INFO = '\x1B[38:2:13:113:166m';
const COLOR_WARN = '\x1B[38:2:255:152:0m';
const COLOR_ERROR = '\x1B[38:2:255:51:44m';

const COLOR_RED = '\x1B[38:2:255:0:0m';
const COLOR_GREEN = '\x1B[38:2:0:255:0m';
const COLOR_BLUE = '\x1B[38:2:0:0:255m';
const COLOR_LIGHT_BLUE = '\x1B[38:2:0:148:255m';

const COLOR_RESET = '\x1B[0m';

export function logDemo()
{
    logDebug("Debug");
    logInfo("Info");
    logWarn("Warn");
    logError("Error");

    logRed("Red");
    logGreen("Green");
    logBlue("Blue");
    logLightBlue("Light Blue");
}

export function logDebug(s: string)
{
    console.log(COLOR_DEBUG + s + COLOR_RESET);
}

export function logInfo(s: string)
{
    console.log(COLOR_INFO + s + COLOR_RESET);
}

export function logWarn(s: string)
{
    console.log(COLOR_WARN + s + COLOR_RESET);
}

export function logError(s: string)
{
    console.log(COLOR_ERROR + s + COLOR_RESET);
}

export function logRed(s: string)
{
    console.log(COLOR_RED + s + COLOR_RESET);
}

export function logGreen(s: string)
{
    console.log(COLOR_GREEN + s + COLOR_RESET);
}

export function logBlue(s: string)
{
    console.log(COLOR_BLUE + s + COLOR_RESET);
}

export function logLightBlue(s: string)
{
    console.log(COLOR_LIGHT_BLUE + s + COLOR_RESET);
}
