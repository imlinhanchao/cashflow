import { Body, Request, Controller, Post, UseGuards, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConfigService } from './config.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { permissions } from 'src/core/Error';
import { UserDto } from 'src/users/users.dto';

@Controller('config')
@ApiTags('Config')
export class InitConfigController {
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
  @UseGuards(JwtAuthGuard)
  create(@Request() { user }: { user: UserDto }, @Body() config: any) {
    if (user.username != 'admin') throw permissions;
    return this.configService.saveConfig(config);
  }

  @Get('')
  @ApiOperation({ summary: '获取配置档' })
  @UseGuards(JwtAuthGuard)
  read(@Request() { user }: { user: UserDto }) {
    if (user.username != 'admin') throw permissions;
    return this.configService.getConfig();
  }
}
