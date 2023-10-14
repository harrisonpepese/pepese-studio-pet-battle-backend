import { EBattleType } from '../enum/battleType.enum';

export class MatchRequestDto {
  petId: string;
  battleType: EBattleType;
}
