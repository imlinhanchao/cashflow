import { Column, Table } from 'sequelize-typescript';
import { CommonModel } from 'src/core/models/common.model';

@Table
export class WechatUser extends CommonModel {

  @Column({ comment: '微信唯一标识', type: 'TINYTEXT' })
  uid: string;

  @Column({ comment: '微信昵称' })
  username: string;

  @Column({ comment: '微信性别' })
  gender: string;

  @Column({ comment: '微信地区' })
  region: string;
}