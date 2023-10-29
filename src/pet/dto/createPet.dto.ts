import { EPetTier } from '../enum/petTier.enum';
import { IsEnum } from 'class-validator';

export class CreatePetDto {
  @IsEnum(EPetTier, { message: 'Invalid pet tier' })
  tier: EPetTier;
}
