import { Column, Table } from 'sequelize-typescript';
import { CommonModel } from 'src/core/models/common.model';

@Table
export class WechatEvent extends CommonModel {

  @Column({ comment: '微信唯一标识', type: 'TINYTEXT' })
  uid: string;

  @Column({ comment: '事件名' })
  event: string;

  @Column({ comment: '参数1', type: 'TEXT' })
  args1: string;

  @Column({ comment: '参数2', type: 'TEXT' })
  args2: string;

  @Column({ comment: '参数3', type: 'TEXT' })
  args3: string;

  @Column({ comment: '参数4', type: 'TEXT' })
  args4: string;
}