import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { MatchRequestDto } from './dto/matchRequest.dto';
import { BattleService } from './battle.service';
import { EBattleType } from './enum/battleType.enum';
import { Battle } from 'pepese-core/dist/battle/class';

@Controller('battle')
export class BattleController {
  constructor(private readonly battleService: BattleService) {}

  @Get(':uuid')
  async getBattle(@Param('uuid') uuid: string): Promise<Battle> {
    return await this.battleService.getBattle(uuid);
  }

  @Post('setRoundAction')
  async addRoundAction(@Request() req, @Body() data: any) {
    const { playerId } = req.handshake.user;
    await this.battleService.addRoundAction(playerId, data);
  }

  @Post('findMatch')
  async findMatch(@Request() req, @Body() data: MatchRequestDto) {
    const { playerId } = req.handshake.user;
    switch (data.battleType) {
      case EBattleType.pve:
        return await this.createPvEBattle(playerId, data.petId);
      case EBattleType.pvp:
        break;
      default:
        break;
    }
  }

  private async createPvEBattle(
    playerId: string,
    petId: string,
  ): Promise<Battle> {
    return this.battleService.createPveBattle({
      playerId,
      petId,
    });
  }
}
