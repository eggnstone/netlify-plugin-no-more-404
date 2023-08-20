import {SystemConfig} from "./SystemConfig";
import {UserConfig} from "./UserConfig";
import {RedirectConfig} from "./RedirectConfig";

export class Config
{
    public readonly redirectConfig: RedirectConfig;
    public readonly userConfig: UserConfig;
    public readonly systemConfig: SystemConfig;

    public constructor(params: {
        redirectConfig: RedirectConfig,
        userConfig: UserConfig,
        systemConfig: SystemConfig
    })
    {
        this.redirectConfig = params.redirectConfig;
        this.userConfig = params.userConfig;
        this.systemConfig = params.systemConfig;
    }
}
