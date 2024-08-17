import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { WsController } from "./ws.controller";
import { WsGateway } from "./ws.gateway";
import { WsService } from "./ws.service";

@Module({
  imports: [AuthModule],
  controllers: [WsController],
  providers: [WsGateway, WsService],
  exports: [WsService],
})
export class WsModule {}
