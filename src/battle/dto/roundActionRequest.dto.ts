import { EActionType } from 'pepese-core/dist/common/enum';

export type TRoundActionRequestDto = {
  battleUuid: string;
  action: EActionType;
  targetId: string;
};
