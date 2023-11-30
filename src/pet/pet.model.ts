import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EElementType } from 'pepese-core';
import { PetAttributes } from './class/petAttributes.class';
import { PetStatus } from './class/petStatus.class';
import { EPetTier } from './enum/petTier.enum';
import { Document, Types } from 'mongoose';
import { EHabitatType } from 'src/common/enum/EHabitat.enum';

export type PetDocument = Pet & Document;
export type TPetCreateProps = Pick<
  Pet,
  'name' | 'playerId' | 'tier' | 'habitat' | 'elemet'
>;
export interface IPetAttributes {
  id?: string;
  name?: string;
  playerId?: string;
  tier?: EPetTier;
  habitat?: EHabitatType;
  elemet?: EElementType;
  baseAttributes?: PetAttributes;
  currentAttributes?: PetAttributes;
  level?: number;
  attributePoints?: number;
  avaliableAttributePoints?: number;
  experience?: number;
  created_at?: Date;
  updated_at?: Date;
}
@Schema()
export class Pet implements IPetAttributes {
  constructor(props?: IPetAttributes) {
    Object.assign(this, props);
    this.created_at = this.created_at || new Date();
    this.updated_at = this.updated_at || new Date();
    if (this.currentAttributes) {
      this.initStatus();
    }
  }
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop({ type: Types.ObjectId, ref: 'Player' })
  playerId: string;
  @Prop()
  tier: EPetTier;
  @Prop()
  habitat: EHabitatType;
  @Prop()
  elemet: EElementType;
  @Prop()
  baseAttributes: PetAttributes;
  @Prop()
  currentAttributes: PetAttributes;
  @Prop({ default: 0 })
  level: number;
  @Prop({ default: 0 })
  attributePoints: number;
  @Prop({ default: 0 })
  avaliableAttributePoints: number;
  @Prop({ default: 0 })
  experience: number;
  @Prop()
  created_at: Date;
  @Prop()
  updated_at: Date;
  status: PetStatus;

  initStatus() {
    this.status = PetStatus.create(this.currentAttributes);
  }

  gainExperience(experience: number) {
    const expToNextLevel = this.calcExperienceToNextLevel(
      this.level,
      this.experience,
    );
    this.experience += experience;
    if (this.experience >= expToNextLevel) {
      this.levelUp();
      this.gainExperience(this.experience - expToNextLevel);
    }
  }

  levelUp() {
    this.level++;
    const attributePoints = Math.floor(this.level / 10 + 1);
    this.attributePoints += attributePoints;
    this.avaliableAttributePoints += attributePoints;
    this.experience = 0;
  }

  calcExperienceToNextLevel(currentLevel: number, currentExp: number) {
    return Math.floor(100 * currentLevel) - currentExp;
  }
  static generate(props: TPetCreateProps) {
    const pet = new Pet();
    pet.name = props.name;
    pet.habitat = props.habitat;
    pet.elemet = props.elemet;
    pet.playerId = props.playerId;
    pet.tier = props.tier;
    pet.level = 1;
    pet.baseAttributes = new PetAttributes({ tier: props.tier });
    pet.currentAttributes = pet.baseAttributes;
    pet.created_at = new Date();
    pet.updated_at = new Date();
    pet.initStatus();
    return pet;
  }
}

export const PetSchema = SchemaFactory.createForClass(Pet);
PetSchema.loadClass(Pet);
