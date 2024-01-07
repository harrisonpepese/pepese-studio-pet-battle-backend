import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'pepese-core/dist/user/class';
import { CreateUserDto } from 'pepese-core/dist/user/dto';
import { EUserRole } from 'pepese-core/dist/user/enum';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User({
      name: createUserDto.name,
      email: createUserDto.email,
      role: EUserRole.player,
      password: createUserDto.password,
      pepeseCoin: 0,
    });
    user.password = await user.hashPassword(createUserDto.password);
    return await this.model.create(user);
  }

  async findAll() {
    return await this.model.find();
  }

  async findById(id: string) {
    return await this.model.findById(id);
  }
  async findByEmail(email: string): Promise<User> {
    const data = await this.model.findOne({ email });
    return new User({
      id: data._id.toString(),
      name: data.name,
      email: data.email,
      pepeseCoin: data.pepeseCoin,
      password: data.password,
      role: data.role,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });
  }

  async remove(id: string) {
    return await this.model.findByIdAndRemove(id);
  }
}
