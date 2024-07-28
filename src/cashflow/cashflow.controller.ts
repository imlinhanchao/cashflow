import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CashflowDto, QueryDto, SyncDto } from './cashflow.dto';
import { CashflowService } from './cashflow.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from 'src/users/users.dto';
import { permissions } from 'src/core/Error';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { decode } from 'iconv-lite';
import { EnumDto } from '../core/Dto/enum.dto';
@Controller('cashflow')
@ApiTags('Cashflow')
export class CashflowController {

  constructor(private readonly cashflowService: CashflowService) { }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '新建交易项目' })
  create(@Request() { user }: { user: UserDto }, @Body() cashflows: CashflowDto[]) {
    cashflows = cashflows.map((cashflow) => {
      cashflow.username = user.username;
      return cashflow;
    });
    return this.cashflowService.create(cashflows);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新交易项目' })
  update(@Request() { user }: { user: UserDto }, @Param('id') id: string, @Body() cashflow: CashflowDto) {
    if (user.username != cashflow.username) throw permissions;
    return this.cashflowService.update(id, cashflow);
  }

  @Get('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '搜索交易记录' })
  query(@Request() { user }: { user: UserDto }, @Query() query: QueryDto) {
    if (user.username != 'admin') query.username = user.username;
    return this.cashflowService.query(query);
  }

  @Get('enum')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '检索字段枚举值' })
  enumField(@Request() { user }: { user: UserDto }, @Query() query: EnumDto) {
    if (user.username != 'admin') query.username = user.username;
    return this.cashflowService.enumField(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取交易明细' })
  async findOne(@Request() { user }: { user: UserDto }, @Param('id') id: string) {
    const cashflow = await this.cashflowService.findOne(id);
    if (user.username != 'admin' && user.username != cashflow.username) throw permissions;
    return cashflow;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除交易记录' })
  async remove(@Request() { user }: { user: UserDto }, @Param('id') id: string) {
    const cashflow = await this.cashflowService.findOne(id);
    if (user.username != 'admin' && user.username != cashflow.username) throw permissions;
    return this.cashflowService.remove(id);
  }


  @Post('analysis')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '同步交易记录' })
  analysis(@Request() { user }: { user: UserDto }, @Body() sync: SyncDto) {
    return this.cashflowService.analysis(user.username, sync);
  }

  @Post('analysisFile')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FilesInterceptor('files'))
  @ApiOperation({ summary: '同步文件交易记录' })
  async analysisFile(@Request() { user }: { user: UserDto }, @UploadedFiles() files: Array<Express.Multer.File>, @Body() sync: SyncDto) {
    if (sync.type == 'alipay') {
      let list = [];
      for (const file of files) {
        const data = decode(file.buffer, 'gbk');
        list = list.concat(await this.cashflowService.readAndSave(
          data.split('\n'), user.username, sync.type
        ));
      }
      return list;
    } else {
      let list = [];
      for (const file of files) {
        const data = file.buffer.toString();
        list = list.concat(await this.cashflowService.readAndSave(
          data.split('\n'), user.username, sync.type
        ));
      }
      return list;
    }
  }
}
