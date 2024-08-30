import { Module } from '@nestjs/common';
import { SequelizeModule } from "@nestjs/sequelize";
import { Report } from './models/report.model';
import { ReportService } from './report.service';
import { ReportController } from './report.controller';

@Module({
  imports: [SequelizeModule.forFeature([Report])],
  providers: [ReportService],
  controllers: [ReportController],
})
export class ReportModule {}
