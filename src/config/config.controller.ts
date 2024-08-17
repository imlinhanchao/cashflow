import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { ConfigService, InitConfigService } from "./config.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { config_already, permissions } from "src/core/Error";
import { UserDto } from "src/users/users.dto";

@Controller("api/config")
@ApiTags("Config")
export class InitConfigController {
  protected readonly configService: InitConfigService;

  constructor(configService: InitConfigService) {
    this.configService = configService;
  }

  @Get("has")
  @ApiOperation({ summary: "是否存在配置档" })
  has() {
    return this.configService.isConfig();
  }

  @Post("")
  @ApiOperation({ summary: "新建配置档" })
  create(@Body() config: any) {
    return this.configService.saveConfig(config);
  }
}

@Controller("api/config")
@ApiTags("Config")
export class ConfigController extends InitConfigController {
  constructor(configService: ConfigService) {
    super(configService);
  }

  @Post("update")
  @ApiOperation({ summary: "修改配置档" })
  @UseGuards(JwtAuthGuard)
  reset(@Request() { user }: { user: UserDto }, @Body() config: any) {
    if (user.username != "admin") throw permissions;
    return this.configService.saveConfig(config);
  }

  @Post("")
  @ApiOperation({ summary: "新建配置档" })
  create(@Body() _: any): string {
    throw config_already;
  }

  @Get("")
  @ApiOperation({ summary: "获取配置档" })
  @UseGuards(JwtAuthGuard)
  read(@Request() { user }: { user: UserDto }) {
    if (user.username != "admin") throw permissions;
    return this.configService.getConfig();
  }
}
