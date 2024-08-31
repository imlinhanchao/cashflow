import { Column, DataType, Table } from "sequelize-typescript";

import { CommonModel } from "src/core/models/common.model";

@Table({})
export class HomeConfig extends CommonModel {
  @Column({ comment: "用户ID", defaultValue: "" })
  username: string;

  @Column({ comment: "行号", defaultValue: 0 })
  row: number;

  @Column({ comment: "列号", defaultValue: 0 })
  column: number;

  @Column({ comment: "宽度", defaultValue: 0 })
  width: number;

  @Column({ comment: "高度", defaultValue: 0 })
  height: number;

  @Column({ comment: "统计报表配置Id", type: DataType.STRING, defaultValue: '' })
  reportId: string;
}
