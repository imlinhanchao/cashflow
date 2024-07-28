import { Body, Controller, Request, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { QueryDto, UserDto, UserUpdateDto } from './users.dto';
import { User } from './models/user.model';
import { UsersService } from './users.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { permissions } from 'src/core/Error';

@Controller('api/users')
@ApiTags('Users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '创建用户' })
  create(@Request() { user }: { user: UserDto }, @Body() createUserDto: UserDto): Promise<User> {
    if (user.username != 'admin') throw permissions;
    return this.usersService.create(createUserDto);
  }

  @Put(':username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '更新用户' })
  update(@Request() { user }: { user: UserDto }, @Param('username') id: string, @Body() updateUserDto: UserUpdateDto): Promise<User> {
    if (user.username != 'admin') throw permissions;
    return this.usersService.update(id, updateUserDto);
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户列表' })
  findAll(@Request() { user }: { user: UserDto }): Promise<User[]> {
    if (user.username != 'admin') throw permissions;
    return this.usersService.findAll().then((users) => {
      users.forEach(this.usersService.clearUnSaftyFields);
      return users;
    });
  }

  @Get('query')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '搜索用户' })
  query(@Request() { user }: { user: UserDto }, @Query() query: QueryDto) {
    if (user.username != 'admin') throw permissions;
    return this.usersService.query(query);
  }

  @Get(':username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '获取用户信息' })
  findOne(@Request() { user }: { user: UserDto }, @Param('username') id: string): Promise<User> {
    if (user.username != 'admin') throw permissions;
    return this.usersService.findOne(id).then(this.usersService.clearUnSaftyFields)
  }

  @Delete(':username')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '删除用户' })
  remove(@Request() { user }: { user: UserDto }, @Param('username') id: string): Promise<void> {
    if (user.username != 'admin') throw permissions;
    return this.usersService.remove(id);
  }
}
