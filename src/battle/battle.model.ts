import { Pet } from 'src/pet/pet.model';
import { EBattleType } from './enum/battleType.enum';
import { EBattleStatus } from './enum/battleStatus.enum';
import { BattlePet } from './class/battlePet.class';

export class Battle {
  constructor() {
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  id: string;
  type: EBattleType;
  status: EBattleStatus;
  blueTeam: BattlePet;
  redTeam: BattlePet;
  winner: 'blue' | 'red';
  created_at: Date;
  updated_at: Date;
}
