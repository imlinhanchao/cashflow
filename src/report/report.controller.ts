import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  Request,
} from "@nestjs/common";
import { ReportService } from "./report.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { UserDto } from "src/users/users.dto";
import { ReportDto } from "./report.dto";
import { permissions } from "src/core/Error";
import { QueryReqDto } from "src/core/Dto/common.dto";

@Controller("api/report")
@ApiTags("Report")
export class ReportController {
  constructor(private readonly service: ReportService) {}

  @Post("create")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "新建报表配置" })
  create(@Request() { user }: { user: UserDto }, @Body() list: ReportDto[]) {
    list = list.map((data) => {
      data.username = user.username;
      return data;
    });
    return this.service.create(list);
  }

  @Put(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "更新报表配置" })
  update(
    @Request() { user }: { user: UserDto },
    @Param("id") id: string,
    @Body() data: ReportDto
  ) {
    if (user.username != data.username) throw permissions;
    return this.service.update(id, data);
  }

  @Get("get/:id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "获取报表配置" })
  findOne(@Param("id") id: string) {
    return this.service.findOne(id);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "删除报表配置" })
  async remove(
    @Request() { user }: { user: UserDto },
    @Param("id") id: string
  ) {
    const cashflow = await this.service.findOne(id);
    if (user.username != "admin" && user.username != cashflow.username)
      throw permissions;
    return this.service.remove(id);
  }

  @Get("search")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "搜索报表配置" })
  search(@Request() { user }: { user: UserDto }, @Query() query: QueryReqDto) {
    if (user.username != "admin") query.username = user.username;
    return this.service.search(query);
  }
}
