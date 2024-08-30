import { Injectable } from '@nestjs/common';
import { Report } from './models/report.model';
import { InjectModel } from '@nestjs/sequelize';
import { ReportDto } from './report.dto';
import { QueryReqDto, QueryRspDto } from 'src/core/Dto/common.dto';
import { isString, markQuery } from 'src/utils';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report)
    private readonly dataModel: typeof Report
  ) {}

  async create(dataList: ReportDto[]): Promise<ReportDto[]> {
    return (await this.dataModel.bulkCreate(dataList as any[])).map((data) =>
      this.format(data.dataValues)
    );
  }

  async update(id: string, datasrc: ReportDto): Promise<ReportDto> {
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
    const update_data: any = {}
    updateField.forEach((field) => {
      if (datasrc[field]) {
        update_data[field] = datasrc[field];
      }
    });
    data.update(update_data);

    return this.format((await data.save()).dataValues);
  }

  async remove(id: string): Promise<ReportDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    await data.destroy();
    return this.format(data);
  }

  async search(data: QueryReqDto): Promise<QueryRspDto<ReportDto>> {
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

  async findOne(id: string): Promise<ReportDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    return this.format(data.dataValues);
  }

  format(data: any): ReportDto {
    data.datasrc = isString(data.datasrc) ? JSON.parse(data.datasrc) : data.datasrc;
    return data;
  }
}
