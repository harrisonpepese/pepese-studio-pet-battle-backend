import { Random } from '../../common/random.service';
import { EPetTier } from '../enum/petTier.enum';

export interface IPetAttributesProps {
  tier: EPetTier;
}

export class PetAttributes {
  constructor(props?: IPetAttributesProps) {
    if (props) {
      this.createBasicAttributes(props.tier);
    }
    this.createBasicAttributes(0);
  }
  strength: number;
  dexterity: number;
  agility: number;
  intelligence: number;
  vitality: number;
  lucky: number;

  private calcTierRange(tier: EPetTier) {
    const min = 1;
    const max = 6;

    return {
      min: min * tier,
      max: max * tier,
    };
  }

  private createBasicAttributes(tier: EPetTier) {
    const { min, max } = this.calcTierRange(tier);
    this.strength = Random.range(min, max);
    this.dexterity = Random.range(min, max);
    this.agility = Random.range(min, max);
    this.intelligence = Random.range(min, max);
    this.vitality = Random.range(min, max);
    this.lucky = Random.range(min, max);
  }
}
