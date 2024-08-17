import { randomUUID } from "crypto";
import { Column, Model } from "sequelize-typescript";

export const ID_TYPE = "CHAR(36) BINARY";
export class CommonModel extends Model {
  @Column({
    type: ID_TYPE,
    defaultValue: () => randomUUID(),
    primaryKey: true,
    allowNull: false,
    comment: "唯一标识",
  })
  id: string;

  @Column({
    type: "BIGINT(1)",
    defaultValue: () => new Date().getTime(),
    allowNull: false,
    comment: "创建时间",
  })
  createdAt: number;

  @Column({
    type: "BIGINT(1)",
    defaultValue: () => new Date().getTime(),
    allowNull: false,
    comment: "更新时间",
  })
  updatedAt: number;
}
