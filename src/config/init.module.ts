import { Module } from "@nestjs/common";
import { InitConfigController } from "./config.controller";
import { InitConfigService } from "./config.service";

@Module({
  controllers: [InitConfigController],
  providers: [InitConfigService],
})
export class InitConfigModule {}
