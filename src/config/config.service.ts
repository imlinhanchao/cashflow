import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import { UsersService } from 'src/users/users.service';
import { configPath } from 'src/utils';

@Injectable()
export class InitConfigService {
  readonly configKeys = [ 'database', 'jwtConstants', 'salt' ];
  readonly configPath = configPath;

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

@Injectable()
export class ConfigService extends InitConfigService {
  constructor(
    private readonly usersService: UsersService,
  ) {
    super()
  }

  isConfig(): boolean {
    const has = super.isConfig();
    if (has) {
      const config = this.resolveConfig();
      if (config.password) {
        this.usersService.create({
          username: 'admin',
          nickname: '超级管理员',
          password: config.password,
          email: config.email,
        }).then(() => {
          delete config.password;
          delete config.email;
          fs.writeFileSync(this.configPath, JSON.stringify(config));
        })
      }
    }

    return has;
  }
}