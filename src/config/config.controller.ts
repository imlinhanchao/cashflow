import { Body, Controller, Get, Post, Headers, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';

@Controller('config')
@ApiTags('Config')
export class ConfigController {
  private readonly configService: ConfigService;

  constructor(
    configService: ConfigService,
  ) {
    this.configService = configService;
  }

  @Post('')
  @ApiOperation({ summary: '新建配置档' })
  create(@Body() config: any) {
    return this.configService.saveConfig(config);
  }
}
