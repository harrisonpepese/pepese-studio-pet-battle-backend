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
import { WebSocketJwtAuthGuard } from '../auth/guard/webSocketJwt.guard';

import { EBattleType } from './enum/battleType.enum';
import { TRoundActionRequestDto } from './dto/roundActionRequest.dto';
import { EBattleEvents } from './enum/battleEvent.enum';
import { EBattleTimer } from './enum/battleTimer.enum';
import { Battle } from 'pepese-core/dist/battle/class';
import { dto } from 'pepese-core/dist/user';

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
        this.configEvents(battle);
        this.server
          .to(battle.uuid)
          .emit('battleChange', this.prepareDataForClient(battle));
        battle.setTimer(5, EBattleTimer.startDelay);
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
  ) {
    const { playerId } = req.handshake.user;
    await this.battleService.addRoundAction(playerId, data);
  }

  private configEvents(battle: Battle) {
    battle.on(EBattleEvents.start, () => this.emitBattleStart(battle));
    battle.on(EBattleEvents.end, async () => {
      this.emitBattleEnd(battle);
      await this.battleService.saveBattleResult(battle);
    });
    battle.on(EBattleEvents.roundStart, () =>
      this.emitBattleRoundStart(battle),
    );
    battle.on(EBattleEvents.roundEnd, () => this.emitBattleRoundEnd(battle));
    battle.on(EBattleEvents.timerTick, () => this.emitBattleTimerTick(battle));
  }

  private emitBattleRoundEnd(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.roundEnd, this.prepareDataForClient(battle));
  }

  private emitBattleRoundStart(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.roundStart, this.prepareDataForClient(battle));
  }

  private emitBattleEnd(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.end, this.prepareDataForClient(battle));
  }

  private emitBattleStart(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.start, this.prepareDataForClient(battle));
  }

  private emitBattleTimerTick(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.timerTick, this.prepareDataForClient(battle));
  }

  async emitBattleChange(battle: Battle) {
    this.server
      .to(battle.uuid)
      .emit(EBattleEvents.onBattleChange, battle.toDto());
  }

  private joinBattleRoom(battleUuid: string, client: Socket) {
    client.join(battleUuid);
  }

  private prepareDataForClient(battle: Battle) {
    const dto = battle.toDto();

    return { ...dto };
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
