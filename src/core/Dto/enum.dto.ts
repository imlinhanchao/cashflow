import { ApiProperty } from "@nestjs/swagger";

export class EnumDto {
  @ApiProperty({ name: 'username', description: '用户名', example: '047f9a52-68e4-4300-8748-70f71267413e' })
  username?: string;
  @ApiProperty({ name: 'key', description: '字段名', example: 'category' })
  key: string;
  @ApiProperty({ name: 'value', description: '字段名', example: '退款' })
  value: string;
  @ApiProperty({ name: 'size', description: '返回数量', example: 10 })
  size: number;
}