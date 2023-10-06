import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { LocalAuthGuard } from './guard/local.guard';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/user.model';
import { CreateUserDto } from 'pepese-core/src/user';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}
  @UseGuards(LocalAuthGuard)
  @Post()
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @Post('singup')
  async singUp(dto: CreateUserDto) {
    let user: User = await this.userService.findByEmail(dto.email);
    if (user) {
      throw 'this email is alreday in use';
    }
    user = await this.userService.create(dto);
    return user;
  }
}
