import { Injectable } from '@nestjs/common';
import { Battle } from './battle.model';
import { TMachQueue } from './types/matchQueue.type';
import { PetService } from 'src/pet/pet.service';
import { PlayerService } from 'src/player/player.service';

@Injectable()
export class BattleService {
  private activeBattles: Battle[] = [];
  private matchQueue: TMachQueue[] = [];
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
  async createBattle(blue: TMachQueue, red: TMachQueue) {
    const battle = new Battle();
    const bluePet = await this.petService.getbyId(blue.petId);
    const redPet = await this.petService.getbyId(red.petId);
    battle.blueTeam = bluePet;
    battle.redTeam = redPet;
    this.activeBattles.push(battle);
    return battle;
  }
  private createPvpBattle() {}
  private createPveBattle() {}
  async getBattle() {
    return 'getBattle';
  }
}
