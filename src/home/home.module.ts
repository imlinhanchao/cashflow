import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeConfig } from './models/home.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReportModule } from 'src/report/report.module';

@Module({
  imports: [SequelizeModule.forFeature([HomeConfig]), ReportModule],
  controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}
