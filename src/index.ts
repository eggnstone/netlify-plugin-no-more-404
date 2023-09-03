import {Checker} from "./Checker";

// noinspection JSUnusedGlobalSymbols
export const onPreBuild = (data: any) => Checker.check({data, isPreflight: true});

// noinspection JSUnusedGlobalSymbols
export const onPostBuild = (data: any) => Checker.check({data, isPreflight: false});
