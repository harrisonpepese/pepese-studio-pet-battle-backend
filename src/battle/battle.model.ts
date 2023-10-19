import { EBattleType } from './enum/battleType.enum';
import { EBattleStatus } from './enum/battleStatus.enum';
import { randomUUID } from 'crypto';
import { BattleRound } from './class/battleRound.class';
import { TBattlePet } from './types/battlepet';
import { EventEmitter } from 'stream';
import { EBattleEvents } from './enum/battleEvent.enum';
import { EBattleAction } from './enum/battleAction.enum';
import { EBattleTimer } from './enum/battleTimer.enum';

export class Battle extends EventEmitter {
  constructor() {
    super();
    this.uuid = randomUUID();
    this.status = EBattleStatus.waiting;
    this.endedRounds = [];
    this.created_at = new Date();
    this.updated_at = new Date();
  }

  id: string;
  uuid: string;
  type: EBattleType;
  status: EBattleStatus;
  endedRounds: BattleRound[];
  currentRound: BattleRound;
  timer: NodeJS.Timeout;
  timerSeconds: number;
  blueTeam: TBattlePet;
  redTeam: TBattlePet;
  winner?: 'blue' | 'red';
  created_at: Date;
  updated_at: Date;

  toDto() {
    return {
      id: this.id,
      uuid: this.uuid,
      type: this.type,
      status: this.status,
      endedRounds: this.endedRounds,
      currentRound: this.currentRound,
      timerSeconds: this.timerSeconds,
      blueTeam: this.blueTeam,
      redTeam: this.redTeam,
      winner: this.winner,
    };
  }
  start() {
    this.status = EBattleStatus.inProgress;
    this.emit(EBattleEvents.start, this.toDto());
    this.createRound();
  }

  setTimer(seconds: number, type: EBattleTimer) {
    this.timerSeconds = seconds;
    this.timer = setInterval(async () => {
      if (this.timerSeconds <= 0) {
        clearInterval(this.timer);
        switch (type) {
          case EBattleTimer.roundActionTimeout:
            this.executeRound();
            return;
          case EBattleTimer.startDelay:
            this.start();
            return;
          default:
            return;
        }
      }
      this.timerSeconds--;
      this.emit(EBattleEvents.timerTick, this.toDto());
    }, 1000);
  }

  createRound() {
    if (!this.currentRound) {
      this.currentRound = new BattleRound({
        blueAction: {
          playerId: this.blueTeam.playerId,
          status: this.blueTeam.pet.status,
          seed: Math.random(),
        },
        redAction: {
          playerId: this.redTeam.playerId,
          status: this.redTeam.pet.status,
          seed: Math.random(),
          action:
            this.type === EBattleType.pve
              ? this.getEnviromentAction()
              : undefined,
        },
      });
      this.emit(EBattleEvents.roundStart, this.toDto());
      this.setTimer(15, EBattleTimer.roundActionTimeout);
    }
  }

  private getEnviromentAction(): EBattleAction {
    return EBattleAction.attack;
    return EBattleAction[
      Object.keys(EBattleAction)[
        Math.floor(Math.random() * Object.keys(EBattleAction).length)
      ]
    ];
  }

  addRoundAction(playerId: string, action: EBattleAction): void {
    const round = this.currentRound;
    round.addAction(playerId, action);
    if (round.canExecute()) {
      clearInterval(this.timer);
      this.executeRound();
    }
  }

  executeRound() {
    const round = this.currentRound;
    round.executeRound();
    this.endedRounds.push(round);
    this.currentRound = undefined;
    this.emit(EBattleEvents.roundEnd, this.toDto());
    this.checkIfBattleEnd();
  }

  end() {
    this.status = EBattleStatus.finished;
    this.emit(EBattleEvents.end, this.toDto());
  }

  private checkIfBattleEnd() {
    if (this.blueTeam.pet.status.currentHealth <= 0) {
      this.winner = 'red';
      return this.end();
    }
    if (this.redTeam.pet.status.currentHealth <= 0) {
      this.winner = 'blue';
      return this.end();
    }
    this.createRound();
  }
}
