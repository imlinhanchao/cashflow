import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { WsModule } from './ws/ws.module';
import { AuthModule } from './auth/auth.module';
import { database } from './config';
import { WechatModule } from './wechat/wechat.module';
import { CashflowModule } from './cashflow/cashflow.module';
import { ChatgptModule } from './chatgpt/chatgpt.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      ...database,
      dialect: 'mysql',
      autoLoadModels: true,
      synchronize: true,
    }),
    UsersModule,
    AuthModule,
    WsModule,
    WechatModule,
    CashflowModule,
    ChatgptModule,
    MailModule,
  ]
})
export class AppModule {}
