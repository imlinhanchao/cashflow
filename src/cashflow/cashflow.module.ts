import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { CashflowController } from "./cashflow.controller";
import { CashflowService } from "./cashflow.service";
import { Cashflow } from "./models/cashflow.model";
import { MailModule } from "src/mail/mail.module";

@Module({
  imports: [SequelizeModule.forFeature([Cashflow]), MailModule],
  providers: [CashflowService],
  controllers: [CashflowController],
})
export class CashflowModule {}
