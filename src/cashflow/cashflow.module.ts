import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CashflowController } from './cashflow.controller';
import { CashflowService } from './cashflow.service';
import { Cashflow } from './models/cashflow.model';

@Module({
  imports: [SequelizeModule.forFeature([Cashflow])],
  providers: [CashflowService],
  controllers: [CashflowController],
})
export class CashflowModule {}
