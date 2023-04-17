import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { WsModule } from 'src/ws/ws.module';
import { WechatEvent } from './models/event.model';
import { WechatMessage } from './models/message.model';
import { WechatUser } from './models/user.model';
import { WechatController } from './wechat.controller';
import { WechatService } from './wechat.service';

@Module({
  imports: [
    WsModule, 
    SequelizeModule.forFeature([WechatMessage, WechatUser, WechatEvent]),
  ],
  controllers: [WechatController],
  providers: [WechatService]
})
export class WechatModule {}
