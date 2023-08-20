import {Checker} from "./Checker";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => Checker.check({data, complete: false});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => Checker.check({data, complete: true});
