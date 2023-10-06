import { Injectable } from '@nestjs/common';

import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, EUserRole } from 'pepese-core/src/user';
import { User } from './user.model';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private model: Model<User>) {}
  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.role = EUserRole.player;
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
    return await this.model.findOne({ email });
  }

  async remove(id: string) {
    return await this.model.findByIdAndRemove(id);
  }
}
