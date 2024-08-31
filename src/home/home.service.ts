import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { HomeDto } from './home.dto';
import { HomeConfig } from './models/home.model';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(HomeConfig)
    private readonly dataModel: typeof HomeConfig
  ) {}

  
  async create(data: HomeDto): Promise<HomeDto> {
    return this.format(await this.dataModel.create(data as any));
  }

  async update(id: string, datasrc: HomeDto): Promise<HomeDto> {
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

  async remove(id: string): Promise<HomeDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    await data.destroy();
    return this.format(data);
  }

  async get(username: string): Promise<HomeDto[]> {
    const data = await this.dataModel.findAll({
      where: { username },
    });
    if (!data) {
      throw new Error("Data Source not found");
    }
    return data.map(d => this.format(d.dataValues));
  }

  async findOne(id: string): Promise<HomeDto> {
    const data = await this.dataModel.findByPk(id);
    if (!data) {
      throw new Error("Data Source not found");
    }
    return this.format(data.dataValues);
  }

  format(data: any): HomeDto {
    return data;
  }

}
