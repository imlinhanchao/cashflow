import { Module } from '@nestjs/common';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { HomeConfig } from './models/home.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([HomeConfig])],
  controllers: [HomeController],
  providers: [HomeService]
})
export class HomeModule {}
