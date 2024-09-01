import { Column, DataType, Table } from "sequelize-typescript";
import { CommonModel } from "src/core/models/common.model";

@Table({})
export class Report extends CommonModel {
  @Column({ comment: "用户ID", defaultValue: "" })
  username: string;

  @Column({ comment: "名称", defaultValue: "" })
  name: string;

  @Column({ comment: "描述", defaultValue: "" })
  description: string;

  @Column({ comment: "数据源", defaultValue: null, type: DataType.JSON })
  datasrc: any;

  @Column({
    comment: "Echart配置",
    type: DataType.TEXT("long"),
  })
  options: string;

  @Column({ comment: "公开", defaultValue: false })
  public: boolean;
}
