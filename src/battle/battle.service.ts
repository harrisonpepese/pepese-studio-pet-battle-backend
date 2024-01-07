import { Injectable } from '@nestjs/common';
import { TMachQueue } from './types/matchQueue';
import { PetService } from 'src/pet/pet.service';
import { PlayerService } from 'src/player/player.service';
import { EBattleType } from './enum/battleType.enum';
import { TRoundActionRequestDto } from './dto/roundActionRequest.dto';
import { Server } from 'socket.io';
import { WebSocketServer } from '@nestjs/websockets';
import { EHabitatType } from 'src/common/enum/EHabitat.enum';
import { EActionType, EElementType } from 'pepese-core/dist/common/enum';
import { Pet } from 'pepese-core/dist/pets/class';
import { EPetTier } from 'pepese-core/dist/pets/enum';
import { Battle } from 'pepese-core/dist/battle/class';

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
    this.activeBattles.push(battle);
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
    this.activeBattles.push(battle);
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
    return this.activeBattles.find((battle) => battle.uuid === uuid);
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
}
