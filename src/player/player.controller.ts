import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { PlayerService } from './player.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('player')
@UseGuards(AuthGuard('jwt'))
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @Get()
  getPlayerByAccountId(@Request() req: any) {
    const accountId = this.getAccountId(req);
    return this.playerService.getPlayerByAccountId(accountId);
  }
  @Post()
  async register(@Request() req: any) {
    const accountId = await this.getAccountId(req);
    return await this.playerService.register(accountId);
  }
  private getAccountId(req: any) {
    return req.user.userId;
  }
}
