import { Inject, Injectable } from '@nestjs/common';
import { TMachQueue } from './types/matchQueue';
import { EBattleType } from './enum/battleType.enum';
import { TRoundActionRequestDto } from './dto/roundActionRequest.dto';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import {
  EActionType,
  EElementType,
  EHabitatType,
} from 'pepese-core/dist/common/enum';
import { Pet } from 'pepese-core/dist/pets/class';
import { EPetTier } from 'pepese-core/dist/pets/enum';
import { Battle } from 'pepese-core/dist/battle/class';
import { PetService } from '../pet/pet.service';
import { PlayerService } from '../player/player.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class BattleService {
  @WebSocketServer() private server: Server;
  constructor(
    private readonly petService: PetService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly playerService: PlayerService,
  ) {}

  async findMatch(prop: TMachQueue) {
    const matchQueue = await this.getMatchQueue();
    matchQueue.push(prop);
    if (matchQueue.length >= 2) {
      const blue = matchQueue.shift();
      const red = matchQueue.shift();
      return { blue, red };
    }
    await this.setMatchQueue(matchQueue);
    return null;
  }

  async createPvpBattle(blue: TMachQueue, red: TMachQueue) {
    const bluePet = await this.petService.getbyId(blue.petId);
    const redPet = await this.petService.getbyId(red.petId);
    const battle = new Battle(
      {
        status: bluePet.status,
        playerId: blue.playerId,
        petId: bluePet.id,
      },
      {
        status: redPet.status,
        playerId: red.playerId,
        petId: redPet.id,
      },
    );
    return battle;
  }

  async createPveBattle(blue: TMachQueue) {
    const bluePet = await this.petService.getbyId(blue.petId);
    const redPet = Pet.generate({
      name: 'CPU',
      habitat: EHabitatType.ground,
      elemet: EElementType.none,
      tier: EPetTier.common,
      playerId: 'cpu',
    });
    bluePet.initStatus();
    redPet.initStatus();
    const battle = new Battle(
      {
        status: redPet.status,
        playerId: 'cpu',
        petId: 'cpu',
      },
      {
        status: bluePet.status,
        playerId: blue.playerId,
        petId: bluePet.id,
      },
    );
    const activeBattles = await this.getActiveBattles();
    activeBattles.push(battle);
    this.setActiveBattles(activeBattles);
    return battle;
  }

  async addRoundAction(playerId: string, prop: TRoundActionRequestDto) {
    const battle = await this.getBattle(prop.battleUuid);
    battle?.addRoundAction({
      playerId,
      action: prop.action,
      targetId: prop.targetId,
    });
    battle?.addRoundAction({
      playerId: 'cpu',
      action: EActionType.attack,
      targetId: battle.blueTeam.playerId,
    });
  }

  async getBattle(uuid: string) {
    const activeBattles = await this.getActiveBattles();
    return activeBattles.find((battle) => battle.uuid === uuid);
  }

  async saveBattleResult(battle: Battle): Promise<void> {
    if (battle.type === EBattleType.pve) {
      return await this.savePveBattleResult(battle);
    }
  }

  private async savePveBattleResult(battle: Battle) {
    //const { pet } = battle.blueTeam;
    //await this.petService.update(pet);
  }

  private async getMatchQueue(): Promise<TMachQueue[]> {
    return await this.getCacheArrayOrCreate('matchQueue');
  }

  private async setMatchQueue(matchQueue: TMachQueue[]): Promise<void> {
    await this.cacheManager.set('matchQueue', JSON.stringify(matchQueue));
  }

  private async getActiveBattles(): Promise<Battle[]> {
    return await this.getCacheArrayOrCreate('activeBattles');
  }

  private async setActiveBattles(battles: Battle[]): Promise<void> {
    await this.cacheManager.set('activeBattles', JSON.stringify(battles));
  }

  private async getCacheArrayOrCreate(key: string) {
    const data = await this.cacheManager.get(key);
    if (data) {
      return JSON.parse(data as string);
    } else {
      this.cacheManager.set(key, JSON.stringify([]));
    }
    return [];
  }
}
