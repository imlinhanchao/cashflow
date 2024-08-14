import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { DatasrcService } from './datasrc.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DataSrcDto } from './datasrc.dto';
import { UserDto } from 'src/users/users.dto';
import { permissions } from 'src/core/Error';
import { QueryReqDto } from 'src/core/Dto/common.dto';

@Controller('api/datasrc')
@ApiTags('Datasrc')
export class DatasrcController {
  constructor(private readonly datasrcService: DatasrcService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '新建数据源' })
  create(@Request() { user }: { user: UserDto }, @Body() list: DataSrcDto[]) {
    list = list.map((data) => {
      data.username = user.username;
      return data;
    });
    return this.datasrcService.create(list);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新数据源' })
  update(@Request() { user }: { user: UserDto }, @Param('id') id: string, @Body() cashflow: DataSrcDto) {
    if (user.username != cashflow.username) throw permissions;
    return this.datasrcService.update(id, cashflow);
  }

  @Get('get/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取数据源' })
  findOne(@Param('id') id: string) {
    return this.datasrcService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除数据源' })
  async remove(@Request() { user }: { user: UserDto }, @Param('id') id: string) {
    const cashflow = await this.datasrcService.findOne(id);
    if (user.username != 'admin' && user.username != cashflow.username) throw permissions;
    return this.datasrcService.remove(id);
  }

  @Get('search')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '搜索数据源' })
  search(@Request() { user }: { user: UserDto }, @Query() query: QueryReqDto) {
    if (user.username != 'admin') query.username = user.username;
    return this.datasrcService.search(query);
  }

}
