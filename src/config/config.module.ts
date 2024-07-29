import { Module } from '@nestjs/common';
import { ConfigController } from './config.controller';
import { ConfigService } from './config.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [ConfigController],
  providers: [ConfigService],
  imports: [UsersModule],
})
export class ConfigModule {}
