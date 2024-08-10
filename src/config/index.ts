import { configPath, hasConfigFile } from 'src/utils';

let config: any = {};
if (hasConfigFile()) {
  config = require(configPath);
}

export const database = config.database;
export const jwtConstants = config.jwtConstants;
export const salt = config.salt;
