import { Column, DataType, Table } from "sequelize-typescript";
import {
  DataFieldDto,
  DataOrderDto,
  SQLWhereDto,
} from "src/core/Dto/common.dto";
import { CommonModel } from "src/core/models/common.model";

@Table({})
export class DataSource extends CommonModel {
  @Column({ comment: "用户ID", defaultValue: "" })
  username: string;

  @Column({ comment: "名称", defaultValue: "" })
  name: string;

  @Column({ comment: "描述", defaultValue: "" })
  description: string;

  @Column({ comment: "字段", defaultValue: [], type: DataType.JSON })
  fields: DataFieldDto[];

  @Column({
    comment: "条件",
    defaultValue: new SQLWhereDto(),
    type: DataType.JSON,
  })
  where: any;

  @Column({ comment: "排序", defaultValue: [], type: DataType.JSON })
  order: DataOrderDto[];

  @Column({ comment: "分组", defaultValue: [], type: DataType.JSON })
  group: string[];

  @Column({ comment: "起始", defaultValue: null })
  index: number;

  @Column({ comment: "数量", defaultValue: null })
  count: number;

  @Column({ comment: "公开", defaultValue: false })
  public: boolean;
}
