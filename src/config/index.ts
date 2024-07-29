import { hasConfigFile } from 'src/utils';

let config: any = {};
if (hasConfigFile()) {
  config = require('./config.json');
}

export const database = config.database;
export const jwtConstants = config.jwtConstants;
export const salt = config.salt;
