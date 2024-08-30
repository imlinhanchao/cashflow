import { Injectable } from "@nestjs/common";
import { DataSource } from "./models/datasrc.model";
import { InjectModel } from "@nestjs/sequelize";
import { DataSrcDto } from "./datasrc.dto";
import { markQuery } from "src/utils";
import { QueryReqDto, QueryRspDto } from "src/core/Dto/common.dto";
import { isString } from "src/utils";

@Injectable()
export class DatasrcService {
  constructor(
    @InjectModel(DataSource)
    private readonly dataModel: typeof DataSource
  ) {}

  async create(dataList: DataSrcDto[]): Promise<DataSrcDto[]> {
    return (await this.dataModel.bulkCreate(dataList as any[])).map((data) =>
      this.format(data.dataValues)
    );
  }

  async update(id: string, datasrc: DataSrcDto): Promise<DataSrcDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    const updateField = [
      "name",
      "description",
      "fields",
      "where",
      "order",
      "group",
      "index",
      "count",
    ];
    const update_data: any = {};
    updateField.forEach((field) => {
      if (datasrc[field]) {
        update_data[field] = datasrc[field];
      }
    });
    data.update(update_data);

    return this.format((await data.save()).dataValues);
  }

  async remove(id: string): Promise<DataSrcDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    await data.destroy();
    return this.format(data);
  }

  async search(data: QueryReqDto): Promise<QueryRspDto<DataSrcDto>> {
    const { page, size, ...query } = data;

    markQuery(query);

    const keys = ["name", "description"];
    Object.keys(query).forEach((key) => {
      if (!keys.includes(key) || !query[key]) {
        delete query[key];
      }
    });

    const total = await this.dataModel.count({
      where: query,
    });

    const rows = (
      await this.dataModel.findAll({
        where: query,
        offset: (page - 1) * size,
        limit: size * 1,
        order: [["createdAt", "DESC"]],
      })
    ).map((rows) => this.format(rows.dataValues));

    return {
      rows,
      total,
    };
  }

  async findOne(id: string): Promise<DataSrcDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    return this.format(data.dataValues);
  }

  format(data: any): DataSrcDto {
    data.fields = isString(data.fields) ? JSON.parse(data.fields) : data.fields;
    data.where = isString(data.where) ? JSON.parse(data.where) : data.where;
    data.order = isString(data.order) ? JSON.parse(data.order) : data.order;
    data.group = isString(data.group) ? JSON.parse(data.group) : data.group;
    return data;
  }
}
