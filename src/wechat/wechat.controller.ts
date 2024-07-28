import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WechatService } from './wechat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserDto } from 'src/users/users.dto';

@Controller('api/wechat')
@ApiTags('WeChat')
export class WechatController {
  wechatService: WechatService;

  constructor(wechatService: WechatService) {
    this.wechatService = wechatService;
  }

  @Post('login')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '登录微信实例' })
  async login(@Request() { user }: { user: UserDto }, ) {
    return this.wechatService.login(user.id);
  }

  @Get('profile')
  @ApiOperation({ summary: '获取登录微信信息' })
  async contacts(@Request() { user }: { user: UserDto }, ) {
    if (!this.wechatService.isLogin(user.id)) return null;
    return this.wechatService.getCurrentUser(user.id);
  }
}
