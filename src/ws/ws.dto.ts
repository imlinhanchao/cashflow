import { ApiProperty } from "@nestjs/swagger";
import { UserDto } from "src/users/users.dto";

export class SocketDto {
  socket?: any;

  @ApiProperty({ name: "channel", description: "频道", example: "hancel" })
  channel: string;

  @ApiProperty({ name: "token", description: "token" })
  token?: string;

  @ApiProperty({ name: "user", description: "用户信息" })
  user?: UserDto;
}
