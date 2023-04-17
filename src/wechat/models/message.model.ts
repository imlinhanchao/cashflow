import { Column, Table } from 'sequelize-typescript';
import { CommonModel } from 'src/core/models/common.model';

@Table
export class WechatMessage extends CommonModel {

  @Column({ comment: '所属账户' })
  user: string;

  @Column({ comment: '发送者' })
  sender: string;

  @Column({ comment: '接收者' })
  reciver: string;

  @Column({ comment: '消息内容', type: 'TEXT' })
  content: string;

  @Column({ defaultValue: '', comment: '消息类型' })
  type: string;

  @Column({ defaultValue: '', comment: '消息文件名' })
  filename: string;

  @Column({ defaultValue: 0, type: 'BIGINT(1)', comment: '发送时间' })
  sent_time: number;

  @Column({ comment: '链接地址', type: 'TINYTEXT' })
  url: string;
}
