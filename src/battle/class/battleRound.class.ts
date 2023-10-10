import { Random } from 'src/common/random.service';
import { TRoundSeed } from '../types/roundSeed';
import { EBattleAction } from '../enum/battleAction.enum';
import { PetStatus } from 'src/pet/class/petStatus.class';

export type TRoundPet = {
  initialStatus: PetStatus;
  resultStatus: PetStatus;
  action?: EBattleAction;
};

export class BattleRound {
  constructor() {
    this.roundSeed = Random.rangeFloat(0.5, 1.5)
  }
  roundSeed:number;

  blueAction: TRoundPet;
  redAction: TRoundPet;

  addBlueAction(action: EBattleAction) {
    this.blueAction.action = action;
  }

  addRedAction(action: EBattleAction) {
    this.redAction.action = action;
  }

  executeRound() {
    const firstAction =
      this.blueAction.initialStatus.speed * this.roundSeed.blueSeed >
      this.redAction.initialStatus.speed * this.roundSeed.redSeed
        ? this.blueAction
        : this.redAction;
    const secondAction =
      firstAction === this.blueAction ? this.redAction : this.blueAction;

    this.executeAction(firstAction, secondAction);
    this.executeAction(secondAction, firstAction);
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
      target.resultStatus.hp -=
        (origin.initialStatus.currentPhysicalAttack * this.) /
        (origin.initialStatus.attack + target.initialStatus.defense);
    }
    if (target.action === EBattleAction.defense) {
    }
    if (target.action === EBattleAction.dodge) {
    }
  }
  rest(origin: TRoundPet) {}
}
