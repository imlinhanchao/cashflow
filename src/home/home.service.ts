import { Report } from "src/report/models/report.model";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomeDto } from './home.dto';
import { HomeConfig } from './models/home.model';
import { ReportService } from "src/report/report.service";

@Injectable()
export class HomeService {
  constructor(
    private readonly reportService: ReportService,
    @InjectModel(HomeConfig)
    private readonly dataModel: typeof HomeConfig
  ) {
    HomeConfig.belongsTo(Report, { foreignKey: 'reportId', as: 'report' });
    Report.hasMany(HomeConfig, { foreignKey: 'reportId' });
  }

  
  async create(data: HomeDto[]): Promise<HomeDto[]> {
    return (await this.dataModel.bulkCreate(data as any)).map((data) =>
      this.format(data.dataValues)
    );
  }

  async update(id: string, datasrc: HomeDto): Promise<HomeDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Home Config not found");
    }
    const updateField = [
      "x",
      "y",
      "w",
      "h",
      "reportId",
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

  async updateAll(data: HomeDto[]): Promise<HomeDto[]> {
    const list = [];
    list.push(...(await this.create(data.filter(d => !d.id))));
    for (const d of data) {
      if (d.id) {
        list.push(await this.update(d.id, d));
      }
    }

    return list;
  }

  async remove(id: string): Promise<HomeDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Home Config not found");
    }
    await data.destroy();
    return this.format(data);
  }

  async get(username: string): Promise<HomeDto[]> {
    const data = await this.dataModel.findAll({
      where: { username },
      include: [{ model: Report, as: 'report' }]
    });
    if (!data) {
      throw new Error("Home Config not found");
    }
    return data.map(d => this.format(d.dataValues));
  }

  async findOne(id: string): Promise<HomeDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Home Config not found");
    }
    return this.format(data.dataValues);
  }

  format(data: any): HomeDto {
    data.index = data.id;
    if (data.report) {
      data.report = this.reportService.format(data.report);
    }
    return data;
  }

}
