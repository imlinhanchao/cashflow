import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserDto } from "src/users/users.dto";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { WsService } from "./ws.service";
import { JwtAuthGuard } from "src/auth/guards/jwt-auth.guard";

@Controller("api/websocket")
@ApiTags("WebSocket")
export class WsController {
  constructor(private readonly eventsService: WsService) {}

  @Get("channels")
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: "获取Channel列表" })
  async channelList(): Promise<string[]> {
    return this.eventsService.channelList();
  }

  @Get(":channel")
  @ApiOperation({ summary: "获取Channel所以链接者" })
  async socketList(@Param("channel") channel: string): Promise<UserDto[]> {
    return this.eventsService.socketList(channel);
  }

  @Post("close")
  @ApiOperation({ summary: "关闭Channel" })
  async channelClose(@Body() { channel }: { channel: string }): Promise<void> {
    return this.eventsService.channelClose(channel);
  }

  @Post("close/:channel")
  @ApiOperation({ summary: "关闭WebSocket" })
  async socketClose(
    @Param("channel") channel: string,
    @Body() { username }: { username: string }
  ): Promise<void> {
    return this.eventsService.socketClose(channel, username);
  }

  @Post("clear")
  @ApiOperation({ summary: "清空Websocket所有连接" })
  async channelCloseAll(): Promise<void> {
    return this.eventsService.channelCloseAll();
  }
}
