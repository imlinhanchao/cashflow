import { Module } from '@nestjs/common';
import { InitConfigModule } from './config/init.module';

@Module({
  imports: [InitConfigModule]
})
export class CfgAppModule {}
