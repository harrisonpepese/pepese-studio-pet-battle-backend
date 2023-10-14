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
        this.joinBattleRoom(battle.uuid, client);
        this.server.to(battle.uuid).emit('battleChange', battle);
        break;
      case EBattleType.pvp:
        break;
      default:
        break;
    }
  }

  @SubscribeMessage('setRoundAction')
  async addRoundAction(
    @Request() req,
    @MessageBody() data: TRoundActionRequestDto,
    @ConnectedSocket() client: Socket,
  ) {
    const { playerId } = req.handshake.user;
    const battle = await this.battleService.addRoundAction(playerId, data);
    this.server.to(data.battleUuid).emit('battleChange', battle);
  }

  async emitBattleRoundEnd(battleUuid: string, battle: Battle) {}

  async emitBattleRoundStart(battleUuid: string, battle: Battle) {}

  async emitBattleEnd(battleUuid: string, battle: Battle) {}

  async emitBattleStart(battleUuid: string, battle: Battle) {}

  async emitBattleChange(battleUuid: string, battle: Battle) {}

  private joinBattleRoom(battleUuid: string, client: Socket) {
    client.join(battleUuid);
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
