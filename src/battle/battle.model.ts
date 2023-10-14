import { EBattleType } from './enum/battleType.enum';
import { EBattleStatus } from './enum/battleStatus.enum';
import { randomUUID } from 'crypto';
import { BattleRound } from './class/battleRound.class';
import { TBattlePet } from './types/battlepet';

export class Battle {
  constructor() {
    this.uuid = randomUUID();
    this.status = EBattleStatus.waiting;
    this.rounds = [];
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  id: string;
  uuid: string;
  type: EBattleType;
  status: EBattleStatus;
  rounds: BattleRound[];
  blueTeam: TBattlePet;
  redTeam: TBattlePet;
  winner: 'blue' | 'red';
  created_at: Date;
  updated_at: Date;

  getActiveRound() {
    return this.rounds[this.rounds.length - 1];
  }
  start() {
    this.status = EBattleStatus.inProgress;
    this.createRound();
  }
  createRound() {
    const round = new BattleRound({
      blueAction: {
        playerId: this.blueTeam.playerId,
        status: this.blueTeam.pet.status,
        seed: Math.random(),
      },
      redAction: {
        playerId: this.redTeam.playerId,
        status: this.redTeam.pet.status,
        seed: Math.random(),
      },
    });
    this.rounds.push(round);
  }
}
