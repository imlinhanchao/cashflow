import { Column, Table } from 'sequelize-typescript';
import { CommonModel } from 'src/core/models/common.model';

@Table
export class User extends CommonModel {
  @Column({ comment: '用户名' })
  username: string;

  @Column({ comment: '昵称' })
  nickname: string;

  @Column({ comment: '密码', defaultValue: '' })
  password: string;

  @Column({ comment: '邮箱', defaultValue: '' })
  email: string;
}
