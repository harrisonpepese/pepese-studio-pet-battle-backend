import { IsEnum } from 'class-validator';
import { EPetTier } from 'pepese-core/dist/pets/enum';

export class CreatePetDto {
  @IsEnum(EPetTier, { message: 'Invalid pet tier' })
  tier: EPetTier;
}
