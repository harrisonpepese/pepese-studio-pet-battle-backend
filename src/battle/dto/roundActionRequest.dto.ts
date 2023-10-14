import { EBattleAction } from '../enum/battleAction.enum';

export type TRoundActionRequestDto = {
  battleUuid: string;
  action: EBattleAction;
};
