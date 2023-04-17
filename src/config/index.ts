import { hasConfigFile } from "./config.module";

let config: any = {};
if (hasConfigFile()) {
  config = require('./config.json');
}

export const database = config.database;
export const jwtConstants = config.jwtConstants;
export const salt = config.salt;
export const chatgpt = config.chatgpt;