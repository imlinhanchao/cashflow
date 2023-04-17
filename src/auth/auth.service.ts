import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/users/users.dto';
import { createHash } from 'crypto';
import { User } from 'src/users/models/user.model';
import { salt } from 'src/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new Error('User or password is wrong');
    }
    pass = createHash('sha256').update(pass + salt).digest('hex');
    if (user && user.password === pass) {
      return this.usersService.clearUnSaftyFields(user);
    }
    throw new Error('User or password is wrong');
  }

  async login(user: any) {
    const payload = { username: user.username, id: user.id };
    return this.jwtService.sign(payload);
  }

  validate(token: string) {
    return this.jwtService.verify(token);
  }

  register(user: UserDto) {
    return this.usersService.create(user).then(this.usersService.clearUnSaftyFields);
  }

  getProfile(username: string) {
    return this.usersService.findOne(username).then(this.usersService.clearUnSaftyFields);
  }
}
