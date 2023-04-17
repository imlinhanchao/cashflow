import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ConfigService {

  readonly configKeys = [ 'database', 'jwtConstants', 'salt', 'chatgpt' ];
  readonly configPath = path.resolve(__dirname, './config.json')

  isConfig(): boolean {
    return fs.existsSync(this.configPath) && this.checkConfig(this.resolveConfig()).length === 0;
  }

  resolveConfig(): any {
    return JSON.parse(fs.readFileSync(this.configPath).toString());
  }

  saveConfig(config: any) {
    const lostKey = this.checkConfig(config);
    if (lostKey.length > 0) {
      throw new Error(`Config lost key: ${lostKey.join(', ')}`);
    }
    fs.writeFileSync(this.configPath, JSON.stringify(config));
    setTimeout(() => process.exit(0), 2000);
    return 'Config saved';
  }

  checkConfig(config: any): string[] {
    return this.configKeys.filter(key => !config[key]);
  }

  getConfig(): any {
    const config = this.resolveConfig();
    config.database.password = '******';
    config.database.username = '******';
    return config;
  }
}
