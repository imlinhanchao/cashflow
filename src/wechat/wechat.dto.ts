import { ApiProperty } from "@nestjs/swagger";

export class WechatDto {
  @ApiProperty({ name: 'name', description: '会话名', example: 'hancel' })
  name: string;
}

export class WechatWho {
  @ApiProperty({ name: 'name', description: '昵称', example: 'hancel' })
  name?: string;
  @ApiProperty({ name: 'id', description: 'wechat Id', example: 'hancel' })
  id?: string;
  @ApiProperty({ name: 'alias', description: '备注', example: 'hancel' })
  alias?: string;
}

export class WechatTalk {
  @ApiProperty({ name: 'name', description: '会话名', example: 'hancel' })
  name: string;
  @ApiProperty({ name: 'to', description: '接收者', example: 'hancel' })
  to: string | WechatWho;
  @ApiProperty({ name: 'text', description: '消息', example: 'hancel' })
  text: string
}