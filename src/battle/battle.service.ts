import { Injectable } from '@nestjs/common';
import { Battle } from './battle.model';
import { TMachQueue } from './types/matchQueue';
import { PetService } from 'src/pet/pet.service';
import { PlayerService } from 'src/player/player.service';
import { EBattleType } from './enum/battleType.enum';
import { Pet } from 'src/pet/pet.model';
import { EElementType, EHabitatType } from 'pepese-core';
import { TRoundActionRequestDto } from './dto/roundActionRequest.dto';
import { EBattleStatus } from './enum/battleStatus.enum';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';

@Injectable()
export class BattleService {
  private activeBattles: Battle[] = [];
  private matchQueue: TMachQueue[] = [];
  @WebSocketServer() private server: Server;
  constructor(
    private readonly petService: PetService,
    private readonly playerService: PlayerService,
  ) {}

  async findMatch(prop: TMachQueue) {
    this.matchQueue.push(prop);
    if (this.matchQueue.length >= 2) {
      const blue = this.matchQueue.shift();
      const red = this.matchQueue.shift();
      return { blue, red };
    }
    return null;
  }

  async createPvpBattle(blue: TMachQueue, red: TMachQueue) {
    const battle = new Battle();
    battle.type = EBattleType.pvp;
    const bluePet = await this.petService.getbyId(blue.petId);
    const redPet = await this.petService.getbyId(red.petId);
    battle.blueTeam = { pet: bluePet, playerId: blue.playerId };
    battle.redTeam = { pet: redPet, playerId: red.playerId };
    this.activeBattles.push(battle);
    return battle;
  }

  async createPveBattle(blue: TMachQueue) {
    const battle = new Battle();
    battle.type = EBattleType.pve;
    const bluePet = new Pet({
      name: 'Microsofto',
      habitat: EHabitatType.ground,
      elemet: EElementType.none,
    });
    const redPet = new Pet({
      name: 'CPU',
      habitat: EHabitatType.ground,
      elemet: EElementType.none,
    });
    bluePet.initStatus();
    redPet.initStatus();
    battle.blueTeam = { pet: bluePet, playerId: blue.playerId };
    battle.redTeam = { pet: redPet, playerId: 'cpu' };
    this.activeBattles.push(battle);
    return battle;
  }

  async addRoundAction(playerId: string, prop: TRoundActionRequestDto) {
    const battle = await this.getBattle(prop.battleUuid);
    if (!battle) {
      throw new Error('Battle not found');
    }
    if (battle.status !== EBattleStatus.inProgress) {
      throw new Error('Battle not in progress');
    }
    battle.addRoundAction(playerId, prop.action);
  }

  async getBattle(uuid: string) {
    return this.activeBattles.find((battle) => battle.uuid === uuid);
  }
}
