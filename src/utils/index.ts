import Package from "../../package.json";
export { isClient } from "./isClient";
export { formatDateToHuman } from "./formatDateToHuman";
export { formatString } from "./formatString";
export { Log } from "./logger";
export { server } from "./server";

export const version = Package.version;
