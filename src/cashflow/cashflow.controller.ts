import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards, Request } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CashflowDto, QueryDto } from './cashflow.dto';
import { CashflowService } from './cashflow.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from 'src/users/users.dto';
import { permissions } from 'src/core/Error';

@Controller('cashflow')
@ApiTags('Cashflow')
export class CashflowController {

  constructor(private readonly cashflowService: CashflowService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '新建交易项目' })
  create(@Request() { user }: { user: UserDto }, @Body() cashflows: CashflowDto[]) {
    cashflows = cashflows.map((cashflow) => {
      cashflow.username = user.id;
      return cashflow;
    });
    return this.cashflowService.create(cashflows);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新交易项目' })
  update(@Request() { user }: { user: UserDto }, @Param('id') id: string, @Body() cashflow: CashflowDto) {
    if (user.id != cashflow.username) throw permissions;
    return this.cashflowService.update(id, cashflow);
  }

  @Get('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '搜索交易记录' })
  query(@Request() { user }: { user: UserDto }, @Query() query: QueryDto) {
    if (user.username != 'admin') query.username = user.id;
    return this.cashflowService.query(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取交易明细' })
  async findOne(@Request() { user }: { user: UserDto }, @Param('id') id: string) {
    const cashflow = await this.cashflowService.findOne(id);
    if (user.username != 'admin' && user.id != cashflow.username) throw permissions;
    return cashflow;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除交易记录' })
  async remove(@Request() { user }: { user: UserDto }, @Param('id') id: string) {
    const cashflow = await this.cashflowService.findOne(id);
    if (user.username != 'admin' && user.id != cashflow.username) throw permissions;
    return this.cashflowService.remove(id);
  }

}
