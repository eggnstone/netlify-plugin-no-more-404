import {Checker} from "./Checker";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => Checker.check({data: data, complete: false});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => Checker.check({data: data, complete: true});
