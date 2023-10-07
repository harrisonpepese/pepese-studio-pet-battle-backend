import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SingInResponseDto } from 'pepese-core';
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

  async login(user: UserDocument): Promise<SingInResponseDto> {
    const payload = { email: user.email, sub: user._id.toString() };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, {
        expiresIn: '4s',
      }),
      expiresIn: 60,
      role: user.role,
      userId: user._id.toString(),
    };
  }

  async refreshToken(refreshToken: string): Promise<SingInResponseDto> {
    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findByEmail(payload.email);
      if (!user) {
        throw 'this token expired';
      }
      return {
        accessToken: this.jwtService.sign(payload),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: '7d',
        }),
        expiresIn: 60,
        role: user.role,
        userId: user.id.toString(),
      };
    } catch (error) {
      throw 'this token expired';
    }
  }
}
