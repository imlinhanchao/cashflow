import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { UserDto } from "src/users/users.dto";
import { HomeService } from "./home.service";
import { permissions } from "src/core/Error";
import { HomeDto } from "./home.dto";

@Controller('api/home')
@ApiTags("Home")
export class HomeController {
  constructor(private readonly service: HomeService) {}

  
  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "添加首页配置" })
  create(@Request() { user }: { user: UserDto }, @Body() list: HomeDto[]) {
    list = list.map((data) => {
      data.username = user.username;
      return data;
    });
    return this.service.create(list);
  }

  @Post("save")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "保存首页配置" })
  updateAll(
    @Request() { user }: { user: UserDto },
    @Body() list: HomeDto[]
  ) {
    if (list.some(d => d.username && d.username != user.username)) throw permissions;
    list = list.map((data) => {
      data.username = user.username;
      return data;
    });
    return this.service.updateAll(list);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "更新首页配置" })
  update(
    @Request() { user }: { user: UserDto },
    @Param("id") id: string,
    @Body() data: HomeDto
  ) {
    if (user.username && user.username != data.username) throw permissions;
    return this.service.update(id, data);
  }

  @Get("get")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "获取首页配置" })
  getAll(@Request() { user }: { user: UserDto }) {
    return this.service.get(user.username);
  }

  @Get("get/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "获取指定首页配置" })
  findOne(@Request() { user }: { user: UserDto }, @Param("id") id: string) {
    return this.service.findOne(id).then((data) => {
      if (user.username != "admin" && user.username != data.username)
        throw permissions;
      return data;
    });
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "删除首页配置" })
  async remove(
    @Request() { user }: { user: UserDto },
    @Param("id") id: string
  ) {
    const cashflow = await this.service.findOne(id);
    if (user.username != "admin" && user.username != cashflow.username)
      throw permissions;
    return this.service.remove(id);
  }

}
