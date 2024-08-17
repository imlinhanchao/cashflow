import {
  Body,
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
} from "@nestjs/common";
import { LoginDto, UserDto } from "src/users/users.dto";
import { User } from "src/users/models/user.model";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { LocalAuthGuard } from "./guards/local-auth.guard";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

@Controller("api/auth")
@ApiTags("Auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @ApiOperation({ summary: "注册" })
  register(@Body() user: UserDto): Promise<User> {
    return this.authService.register(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post("login")
  @ApiOperation({ summary: "登录" })
  async login(@Request() { user }: { user: UserDto }, @Body() __: LoginDto) {
    return this.authService.login(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  @ApiBearerAuth("Authorization")
  @ApiOperation({ summary: "获取登录用户信息" })
  getProfile(@Request() { user }: { user: UserDto }) {
    return this.authService.getProfile(user.username);
  }
}
