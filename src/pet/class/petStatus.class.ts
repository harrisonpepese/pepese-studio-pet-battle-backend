import { PetAttributes } from './petAttributes.class';
export interface IPetStatus {
  health: number;
  stamina: number;
  physicalAttack: number;
  magicAttack: number;
  physicalDefense: number;
  magicaDefense: number;
  speed: number;
  acurency: number;
  dodge: number;
}
export interface IPetStatusCurrent {
  currentHealth: number;
  currentStamina: number;
  currentPhysicalAttack: number;
  currentMagicAttack: number;
  currentPhysicalDefense: number;
  currentMagicaDefense: number;
  currentSpeed: number;
  currentAcurency: number;
  currentDodge: number;
}
export class PetStatus {
  constructor(params: IPetStatus) {
    this.health = params.health;
    this.stamina = params.stamina;
    this.physicalAttack = params.physicalAttack;
    this.magicAttack = params.magicAttack;
    this.physicalDefense = params.physicalDefense;
    this.magicaDefense = params.magicaDefense;
    this.speed = params.speed;
    this.acurency = params.acurency;
    this.dodge = params.dodge;
    this.currentHealth = params.health;
    this.currentStamina = params.stamina;
    this.currentPhysicalAttack = params.physicalAttack;
    this.currentMagicAttack = params.magicAttack;
    this.currentPhysicalDefense = params.physicalDefense;
    this.currentMagicaDefense = params.magicaDefense;
    this.currentSpeed = params.speed;
    this.currentAcurency = params.acurency;
    this.currentDodge = params.dodge;
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

  currentHealth: number;
  currentStamina: number;
  currentPhysicalAttack: number;
  currentMagicAttack: number;
  currentPhysicalDefense: number;
  currentMagicaDefense: number;
  currentSpeed: number;
  currentAcurency: number;
  currentDodge: number;

  damage(damage: number) {
    this.currentHealth -= damage;
    if (this.health < 0) this.health = 0;
  }
  heal(heal: number) {
    this.currentHealth += heal;
    if (this.currentHealth > this.health) this.currentHealth = this.health;
  }
  restoreStamina(stamina: number) {
    this.currentStamina += stamina;
    if (this.currentStamina > this.stamina) this.currentStamina = this.stamina;
  }
  spendStamina(stamina: number) {
    this.currentStamina -= stamina;
    if (this.currentStamina < 0) this.currentStamina = 0;
  }

  static create(attributes: PetAttributes): PetStatus {
    return new PetStatus({
      health: this.calcHealth(attributes),
      stamina: this.calcStamina(attributes),
      physicalAttack: this.calcPhysicalAttack(attributes),
      magicAttack: this.calcMagicAttack(attributes),
      physicalDefense: this.calcPhysicalDefense(attributes),
      magicaDefense: this.calcMagicaDefense(attributes),
      speed: this.calcSpeed(attributes),
      acurency: this.calcAcurency(attributes),
      dodge: this.calcDodge(attributes),
    });
  }

  private static calcHealth(attributes: PetAttributes) {
    const { vitality, dexterity } = attributes;
    const minHealth = 20;
    const baseHealth = minHealth + vitality * 5 + Math.round(dexterity / 5);
    return Math.round(
      baseHealth + baseHealth * (Math.floor(vitality / 10) / 100),
    );
  }

  private static calcStamina(attributes: PetAttributes): number {
    const { intelligence, dexterity } = attributes;
    const min = 20;
    const base = min + intelligence * 5 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  private static calcPhysicalAttack(attributes: PetAttributes): number {
    const { strength, dexterity } = attributes;
    const min = 1;
    const base = min + strength * 1 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(strength / 10) / 100));
  }

  private static calcMagicAttack(attributes: PetAttributes): number {
    const { intelligence, dexterity } = attributes;
    const min = 1;
    const base = min + intelligence * 5 + Math.round(dexterity / 5);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  private static calcPhysicalDefense(attributes: PetAttributes): number {
    const { vitality, dexterity, strength } = attributes;
    const min = 1;
    const base =
      min + vitality * 1 + Math.round(dexterity / 4) + Math.round(strength / 3);
    return Math.round(base + base * (Math.floor(strength / 10) / 100));
  }

  private static calcMagicaDefense(attributes: PetAttributes): number {
    const { vitality, dexterity, intelligence } = attributes;
    const min = 1;
    const base =
      min +
      vitality * 1 +
      Math.round(dexterity / 4) +
      Math.round(intelligence / 3);
    return Math.round(base + base * (Math.floor(intelligence / 10) / 100));
  }

  private static calcSpeed(attributes: PetAttributes): number {
    const { agility, dexterity } = attributes;
    const min = 1;
    const base = min + agility * 5 + Math.round(dexterity / 6);
    return Math.round(base + base * (Math.floor(agility / 10) / 100));
  }

  private static calcAcurency(attributes: PetAttributes): number {
    const { dexterity, agility } = attributes;
    const min = 1;
    const base = min + dexterity * 5 + Math.round(agility / 6);
    return Math.round(base + base * (Math.floor(dexterity / 10) / 100));
  }

  private static calcDodge(attributes: PetAttributes): number {
    const { dexterity, agility } = attributes;
    const min = 1;
    const base = min + agility * 5 + Math.round(dexterity / 6);
    return Math.round(base + base * (Math.floor(agility / 10) / 100));
  }
}
