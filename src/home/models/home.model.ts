import { Column, DataType, Table } from "sequelize-typescript";

import { CommonModel } from "src/core/models/common.model";

@Table({})
export class HomeConfig extends CommonModel {
  @Column({ comment: "用户ID", defaultValue: "" })
  username: string;

  @Column({ comment: "行号", defaultValue: 0 })
  x: number;

  @Column({ comment: "列号", defaultValue: 0 })
  y: number;

  @Column({ comment: "宽度", defaultValue: 0 })
  w: number;

  @Column({ comment: "高度", defaultValue: 0 })
  h: number;

  @Column({ comment: "统计报表配置Id", type: DataType.STRING, defaultValue: '' })
  reportId: string;
}
