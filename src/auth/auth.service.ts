import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument } from 'src/user/user.model';

import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (user && (await user.verifyPassword(pass))) {
      return user;
    }
    return null;
  }

  async login(user: UserDocument) {
    const payload = { username: user.name, sub: user._id.toString() };
    return {
      access_token: this.jwtService.sign(payload),
      username: user.name,
    };
  }
}
