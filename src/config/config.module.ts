import { Module } from '@nestjs/common';
import { InitConfigController, ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import * as fs from 'fs';
import * as path from 'path'

@Module({
  controllers: [hasConfigFile() ? ConfigController : InitConfigController],
  providers: [ConfigService]
})
export class ConfigModule {}

export function hasConfigFile() {
  return fs.existsSync(path.resolve(__dirname, './config.json'));
}