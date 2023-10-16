import { EBattleType } from './enum/battleType.enum';
import { EBattleStatus } from './enum/battleStatus.enum';
import { randomUUID } from 'crypto';
import { BattleRound } from './class/battleRound.class';
import { TBattlePet } from './types/battlepet';
import { EventEmitter } from 'stream';
import { EBattleEvents } from './enum/battleEvent.enum';
import { EBattleAction } from './enum/battleAction.enum';

export class Battle extends EventEmitter {
  constructor() {
    super();
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
    this.emit(EBattleEvents.start, this);
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
    this.emit(EBattleEvents.roundStart, this);
  }
  addRoundAction(playerId: string, action: EBattleAction) {
    const round = this.getActiveRound();
    round.addAction(playerId, action);
  }
  executeRound() {
    const round = this.getActiveRound();
    round.executeRound();
    this.emit(EBattleEvents.roundEnd, this);
    this.checkIfBattleEnd();
  }

  end() {
    this.status = EBattleStatus.finished;
    this.emit(EBattleEvents.end, this);
  }

  private checkIfBattleEnd() {
    if (this.blueTeam.pet.status.currentHealth <= 0) {
      this.winner = 'red';
      this.end();
    }
    if (this.redTeam.pet.status.currentHealth <= 0) {
      this.winner = 'blue';
      this.end();
    }
  }
}
