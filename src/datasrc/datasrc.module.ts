import { Module } from '@nestjs/common';
import { DatasrcService } from './datasrc.service';
import { DatasrcController } from './datasrc.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { DataSource } from './models/datasrc.model';

@Module({
  imports: [SequelizeModule.forFeature([DataSource])],
  providers: [DatasrcService],
  controllers: [DatasrcController]
})
export class DatasrcModule {}
