import { Random } from 'src/utils/random.service';
import { EBattleAction } from '../enum/battleAction.enum';
import { PetStatus } from 'src/pet/class/petStatus.class';

export type TRoundPet = {
  playerId: string;
  initialStatus: PetStatus;
  resultStatus: PetStatus;
  action?: EBattleAction;
  seed: number;
};

export enum ERoundStatus {
  notStarted,
  awaitingActions,
  finished,
}

export interface IBattleRoundProps {
  blueAction: TRoundPet;
  redAction: TRoundPet;
}
export class BattleRound {
  constructor(props: IBattleRoundProps) {
    this.blueAction = props.blueAction;
    this.redAction = props.redAction;
    this.status = ERoundStatus.notStarted;
    this.roundSeed = Random.rangeFloat(0.5, 1.5);
  }
  status: ERoundStatus;
  roundSeed: number;
  blueAction: TRoundPet;
  redAction: TRoundPet;

  addAction(playerId: string, action: EBattleAction) {
    if (playerId === this.blueAction.playerId) {
      this.blueAction.action = action;
      return;
    }
    this.redAction.action = action;
  }

  startRound() {
    this.status = ERoundStatus.awaitingActions;
  }

  executeRound() {
    const firstAction =
      this.blueAction.initialStatus.currentSpeed * this.roundSeed >
      this.redAction.initialStatus.currentSpeed * this.roundSeed
        ? this.blueAction
        : this.redAction;
    const secondAction =
      firstAction === this.blueAction ? this.redAction : this.blueAction;

    this.executeAction(firstAction, secondAction);
    this.executeAction(secondAction, firstAction);
    this.status = ERoundStatus.finished;
  }

  executeAction(origin: TRoundPet, target: TRoundPet) {
    if (origin.action === EBattleAction.attack) {
      this.baseAttack(origin, target);
    }
    if (origin.action === EBattleAction.rest) {
      this.rest(origin);
    }
  }

  baseAttack(origin: TRoundPet, target: TRoundPet) {
    if (
      !target.action ||
      target.action === EBattleAction.attack ||
      target.action === EBattleAction.rest
    ) {
      target.resultStatus.currentHealth -=
        origin.initialStatus.currentPhysicalAttack;
    }
    if (target.action === EBattleAction.defense) {
      target.resultStatus.currentHealth -= Math.floor(
        origin.initialStatus.currentPhysicalAttack / 2,
      );
    }
    if (target.action === EBattleAction.dodge) {
      if (
        target.initialStatus.currentDodge > origin.initialStatus.currentAcurency
      ) {
        target.resultStatus.currentHealth -=
          origin.initialStatus.currentPhysicalAttack;
      }
    }
  }
  rest(origin: TRoundPet) {}
}
