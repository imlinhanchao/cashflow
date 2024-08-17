import { ApiProperty } from "@nestjs/swagger";

export class UserDto {
  @ApiProperty({
    name: "id",
    description: "用户ID",
    example: "047f9a52-68e4-4300-8748-70f71267413e",
  })
  id?: string;

  @ApiProperty({ name: "username", description: "用户名", example: "hancel" })
  username: string;

  @ApiProperty({ name: "nickname", description: "昵称", example: "hancel" })
  nickname: string;

  @ApiProperty({ name: "password", description: "密码", example: "123456" })
  password?: string;

  @ApiProperty({
    name: "email",
    description: "邮箱",
    example: "hancel@domain.com",
  })
  email: string;
}

export class UserUpdateDto extends UserDto {
  @ApiProperty({
    name: "oldPassword",
    description: "旧密码，仅仅修改密码需要传递",
    example: "123456",
  })
  oldPassword?: string;
}

export class LoginDto {
  @ApiProperty({
    name: "username",
    description: "用户名",
    example: "imlinhanchao",
  })
  username: string;

  @ApiProperty({ name: "password", description: "密码", example: "123456" })
  password?: string;
}

// 分页查询Dto
export class QueryDto {
  page: number;
  size: number;
  username: string;
  nickname?: string;
  email?: string;
}
