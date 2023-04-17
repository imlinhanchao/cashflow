import { Column, DataType, Table } from 'sequelize-typescript';
import { CommonModel, ID_TYPE } from 'src/core/models/common.model';

@Table
export class Cashflow extends CommonModel {
  @Column({ comment: '用户ID', defaultValue: '', type: ID_TYPE })
  username: string;

  @Column({ comment: '收/支', defaultValue: '' })
  type: string;

  @Column({ comment: '交易对方', defaultValue: '' })
  counterparty: string;

  @Column({ comment: '商品说明', defaultValue: '' })
  description: string;

  @Column({ comment: '支付方式', defaultValue: '' })
  payment: string;

  @Column({ comment: '金额', defaultValue: 0, type: DataType.DECIMAL(10, 2) })
  amount: number;

  @Column({ comment: '交易状态', defaultValue: '' })
  status: string;

  @Column({ comment: '交易分类', defaultValue: '' })
  category: string;

  @Column({ comment: '交易订单号', defaultValue: '' })
  orderNumber: string;

  @Column({ comment: '商家订单号', defaultValue: '' })
  merchantNumber: string;

  @Column({ comment: '交易时间', type: DataType.TIME })
  transactionTime: string;

  @Column({ comment: '备注', defaultValue: '' })
  remark: string;

}
