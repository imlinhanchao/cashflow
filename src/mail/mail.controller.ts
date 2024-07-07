import { Controller, Param, Post, UseGuards, Request, Body, Query, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from 'src/users/users.dto';
import { MailConfigDto } from './mail.dto';
import { MailService } from './mail.service';

@Controller('mail')
@ApiTags('Mail')
export class MailController {
  constructor(
    private readonly mailService: MailService
  ) {
    //
  }

  @UseGuards(JwtAuthGuard)
  @Post('connect')
  @ApiOperation({ summary: '连接邮箱' })
  connect(@Request() { user }: {user: UserDto} , @Body() account: MailConfigDto) {
    return this.mailService.connect(user.username, account);
  }

  @UseGuards(JwtAuthGuard)
  @Get('getUnread')
  @ApiOperation({ summary: '获取未读邮件' })
  getUnread(@Request() { user }: {user: UserDto}, @Query('count') count: number = -1) {
    return this.mailService.getUnread(user.username, count);
  }

  @UseGuards(JwtAuthGuard)
  @Post('stop')
  @ApiOperation({ summary: '停止邮箱' })
  stop(@Request() { user }: {user: UserDto}) {
    return this.mailService.stop(user.username);
  }

  @UseGuards(JwtAuthGuard)
  @Get('get')
  @ApiOperation({ summary: '获取最新邮件' })
  getLatest(@Request() { user }: {user: UserDto}, @Query('count') count: number) {
    return this.mailService.getLatest(user.username, count);
  }

  @UseGuards(JwtAuthGuard)
  @Get('search')
  @ApiOperation({ summary: '搜索最新邮件' })
  searchLatest(
    @Request() { user }: {user: UserDto}, 
    @Query('text') text: string, 
    @Query('count') count: number
  ) {
    return this.mailService.searchLatest(user.username, text, count);
  }
}
