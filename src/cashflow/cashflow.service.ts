import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { QueryRspDto } from 'src/core/Dto/common.dto';
import { CashflowDto } from './cashflow.dto';
import { Cashflow } from './models/cashflow.model';

@Injectable()
export class CashflowService {

  constructor(
    @InjectModel(Cashflow)
    private readonly cashflowModel: typeof Cashflow,
  ) {}

  async create(cashflows: CashflowDto[]): Promise<Cashflow[]> {
    return await this.cashflowModel.bulkCreate(cashflows as any[]);
  }

  async update(id: string, cashflow: CashflowDto): Promise<Cashflow> {
    const cashflowToUpdate = await this.cashflowModel.findByPk(id);
    if (!cashflowToUpdate) {
      throw new Error('Cashflow not found');
    }
    const updateField = ['amount', 'remark', 'counterparty', 'description', 'category', 'status'];
    updateField.forEach((field) => {
      if (cashflow[field]) {
        cashflowToUpdate[field] = cashflow[field];
      }
    });

    return await cashflowToUpdate.save();
  }

  async remove(id: string): Promise<Cashflow> {
    const cashflowToRemove = await this.cashflowModel.findByPk(id);
    if (!cashflowToRemove) {
      throw new Error('Cashflow not found');
    }
    await cashflowToRemove.destroy();
    return cashflowToRemove;
  }

  async findOne(id: string): Promise<Cashflow> {
    const cashflow = await this.cashflowModel.findByPk(id);
    if (!cashflow) {
      throw new Error('Cashflow not found');
    }
    return cashflow;
  }

  async query(data): Promise<QueryRspDto<Cashflow>> {
    // 分页查询，按照交易时间倒序
    const { page, size, ...query } = data;
    if (query.transactionTimeStart || query.transactionTimeEnd) {
      query.transactionTime = {
        $gte: query.transactionTimeStart,
        $lte: query.transactionTimeEnd,
      };
    }
    if (query.amountMin || query.amountMax) {
      query.amount = {
        $gte: query.amountMin,
        $lte: query.amountMax,
      };
    }
    if (query.remark) {
      query.remark = {
        $like: `%${query.remark}%`,
      };
    }
    if (query.counterparty) {
      query.counterparty = {
        $like: `%${query.counterparty}%`,
      };
    }
    if (query.description) {
      query.description = {
        $like: `%${query.description}%`,
      };
    }

    const total = await this.cashflowModel.count({
      where: query,
    });

    return {
      data: await this.cashflowModel.findAll({
        where: query,
        offset: (page - 1) * size,
        limit: size,
        order: [['transactionTime', 'DESC']],
      }),
      total,
    }
  }
}
