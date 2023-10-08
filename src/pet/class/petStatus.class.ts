import { PetAttributes } from './petAttributes.class';

export interface IPetStatus {
  health: number;
  stamina: number;
  physicalAttack: number;
  magicAttack: number;
  physicalDefense: number;
  magicaDefense: number;
  speed: number;
}

export class PetStatus {
  constructor(attributes: PetAttributes) {
    this.health = this.calcHealth(attributes);
    this.stamina = this.calcStamina(attributes);
  }
  health: number;
  stamina: number;
  physicalAttack: number;
  magicAttack: number;
  physicalDefense: number;
  magicaDefense: number;
  speed: number;
  acurency: number;
  dodge: number;

  calcStatus(attributes: PetAttributes) {
    this.health = this.calcHealth(attributes);
  }

  calcHealth(attributes: PetAttributes) {
    const { vitality, dexterity } = attributes;
    const minHealth = 20;
    const baseHealth = minHealth + vitality * 5 + Math.round(dexterity / 5);
    return Math.round(
      baseHealth + baseHealth * (Math.floor(vitality / 10) / 100),
    );
  }

  calcStamina(attributes: PetAttributes): number {
    const { intelligence, dexterity } = attributes;
    const min = 20;
    const base = min + intelligence * 5 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  calcPhysicalAttack(attributes: PetAttributes): number {
    const { strength, dexterity } = attributes;
    const min = 1;
    const base = min + strength * 5 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(strength / 10) / 100));
  }

  calcMagicAttack(attributes: PetAttributes): number {
    const { intelligence, dexterity } = attributes;
    const min = 1;
    const base = min + intelligence * 5 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  calcPhysicalDefense(attributes: PetAttributes): number {
    const { vitality, dexterity, strength } = attributes;
    const min = 1;
    const base =
      min + vitality * 1 + Math.round(dexterity / 4) + Math.round(strength / 3);
    return Math.round(base + base * (Math.floor(strength / 10) / 100));
  }

  calcMagicaDefense(attributes: PetAttributes): number {
    const { vitality, dexterity, intelligence } = attributes;
    const min = 1;
    const base =
      min +
      vitality * 1 +
      Math.round(dexterity / 4) +
      Math.round(intelligence / 3);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  calcSpeed(attributes: PetAttributes): number {
    const { agility, dexterity } = attributes;
    const min = 1;
    const base = min + agility * 5 + Math.round(dexterity / 6);
    return Math.round(base + base * (Math.floor(agility / 10) / 100));
  }

  calcAcurency(attributes: PetAttributes): number {
    const { dexterity, agility } = attributes;
    const min = 1;
    const base = min + dexterity * 5 + Math.round(agility / 6);
    return Math.round(base + base * (Math.floor(dexterity / 10) / 100));
  }

  calcDodge(attributes: PetAttributes): number {
    const { dexterity, agility } = attributes;
    const min = 1;
    const base = min + agility * 5 + Math.round(dexterity / 6);
    return Math.round(base + base * (Math.floor(agility / 10) / 100));
  }
}
