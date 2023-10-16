import { Random } from 'src/utils/random.service';
import { EBattleAction } from '../enum/battleAction.enum';
import { PetStatus } from 'src/pet/class/petStatus.class';

export type TRoundPet = {
  playerId: string;
  status: PetStatus;
  action?: EBattleAction;
  seed: number;
};

export enum ERoundStatus {
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
    this.status = ERoundStatus.awaitingActions;
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

  executeRound() {
    const firstAction =
      this.blueAction.status.currentSpeed * this.roundSeed >
      this.redAction.status.currentSpeed * this.roundSeed
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
    if (target.action === EBattleAction.defense) {
      target.status.damage(Math.floor(origin.status.currentPhysicalAttack / 2));
      return;
    }
    if (target.action === EBattleAction.dodge) {
      if (target.status.currentDodge > origin.status.currentAcurency) {
        return;
      }
    }
    target.status.damage(origin.status.currentPhysicalAttack);
  }

  rest(origin: TRoundPet) {
    origin.status.heal(Math.floor(origin.status.health * 0.1));
    origin.status.restoreStamina(Math.floor(origin.status.stamina * 0.1));
  }
}
