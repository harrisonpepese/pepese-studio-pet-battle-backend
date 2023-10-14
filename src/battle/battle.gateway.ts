import { UseGuards, Request } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { BattleService } from './battle.service';
import { MatchRequestDto } from './dto/matchRequest.dto';
import { WebSocketJwtAuthGuard } from 'src/auth/guard/webSocketJwt.guard';
import { Battle } from './battle.model';
import { EBattleType } from './enum/battleType.enum';
import { TRoundActionRequestDto } from './dto/roundActionRequest.dto';

@WebSocketGateway({ namespace: 'battle', cors: '*:*' })
@UseGuards(WebSocketJwtAuthGuard)
export class BattleGateway {
  @WebSocketServer() server: Server;
  constructor(private readonly battleService: BattleService) {}

  @SubscribeMessage('findMatch')
  async findMatch(
    @Request() req,
    @MessageBody() data: MatchRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { playerId } = req.handshake.user;
    switch (data.battleType) {
      case EBattleType.pve:
        console.log('pve');
        const battle = await this.createPvEBattle(playerId, data.petId);
        this.joinBattleRoom(battle.id, client);
        client.emit('battleChange', battle);
        break;
      case EBattleType.pvp:
        break;
      default:
        break;
    }
  }

  async addRoundAction(
    @Request() req,
    @MessageBody() data: TRoundActionRequestDto,
  ) {
    const { playerId } = req.handshake.user;
    const battle = await this.battleService.addRoundAction(playerId, data);
    this.server.to(data.battleId).emit('battleChange', battle);
  }

  async emitBattleRoundEnd(battleId: string, battle: Battle) {}

  async emitBattleRoundStart(battleId: string, battle: Battle) {}

  async emitBattleEnd(battleId: string, battle: Battle) {}

  async emitBattleStart(battleId: string, battle: Battle) {}

  async emitBattleChange(battleId: string, battle: Battle) {}

  private async joinBattleRoom(battleId: string, client: Socket) {
    client.join(battleId);
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
