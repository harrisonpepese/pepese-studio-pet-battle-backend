import { EBattleAction } from '../enum/battleAction.enum';

export type TRoundActionRequestDto = {
  battleId: string;
  action: EBattleAction;
};
