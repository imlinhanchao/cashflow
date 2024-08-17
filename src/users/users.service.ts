import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { UserDto, UserUpdateDto } from "./users.dto";
import { User } from "./models/user.model";
import { createHash } from "crypto";
import { salt } from "src/config";
import { QueryRspDto } from "src/core/Dto/common.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}

  async create(user: UserDto): Promise<User> {
    user.password = createHash("sha256")
      .update(user.password + salt)
      .digest("hex");
    if (await this.findOne(user.username)) {
      throw new Error("User already exists");
    }
    return await this.userModel.create({
      ...user,
    });
  }

  async update(username, user: UserUpdateDto): Promise<User> {
    const userToUpdate = await this.findOne(username);
    if (!userToUpdate) {
      throw new Error("User not found");
    }
    if (
      user.password &&
      userToUpdate.password !=
        createHash("sha256")
          .update(user.oldPassword + salt)
          .digest("hex")
    ) {
      throw new Error("The Old Password was wrong");
    }

    const updateField = ["nickname", "email", "password"];
    updateField.forEach((field) => {
      if (user[field]) {
        userToUpdate[field] = user[field];
      }
    });

    return await userToUpdate.save();
  }

  findAll(): Promise<User[]> {
    return this.userModel.findAll();
  }

  async query(data): Promise<QueryRspDto<User>> {
    // 分页查询，按照创建时间倒序
    const { page, size, ...query } = data;
    if (query.nickname) {
      query.nickname = {
        $like: `%${query.nickname}%`,
      };
    }

    if (query.email) {
      query.email = {
        $like: `%${query.email}%`,
      };
    }

    const total = await this.userModel.count({
      where: query,
    });

    return {
      rows: await this.userModel.findAll({
        where: query,
        offset: (page - 1) * size,
        limit: size,
        order: [["createdAt", "DESC"]],
      }),
      total,
    };
  }

  async findOne(username: string): Promise<User> {
    const user = await this.userModel.findOne({
      where: {
        username,
      },
    });
    return user;
  }

  async remove(username: string): Promise<void> {
    const user = await this.findOne(username);
    if (!user) {
      throw new Error("User not found");
    }
    await user.destroy();
  }

  clearUnSaftyFields(user: User) {
    user.password = "******";
    return user;
  }
}
