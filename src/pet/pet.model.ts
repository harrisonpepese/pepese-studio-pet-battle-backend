import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EElementType } from 'pepese-core';
import { PetAttributes } from './class/petAttributes.class';
import { PetStatus } from './class/petStatus.class';
import { EPetTier } from './enum/petTier.enum';
import { Document, Types } from 'mongoose';
import { EHabitatType } from 'src/common/enum/EHabitat.enum';

export type PetDocument = Pet & Document;
export type IPetProps = Pick<
  Pet,
  'name' | 'playerId' | 'tier' | 'habitat' | 'elemet'
>;
@Schema()
export class Pet {
  constructor(props: IPetProps) {
    this.name = props.name;
    this.habitat = props.habitat;
    this.elemet = props.elemet;
    this.playerId = props.playerId;
    this.tier = props.tier;
    this.level = 1;
    this.baseAttributes = new PetAttributes({ tier: props.tier });
    this.currentAttributes = this.baseAttributes;
    this.created_at = new Date();
    this.updated_at = new Date();
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
  @Prop()
  level: number;
  @Prop()
  attributePoints: number;
  @Prop()
  avaliableAttributePoints: number;
  @Prop()
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
}

export const PetSchema = SchemaFactory.createForClass(Pet);
PetSchema.loadClass(Pet);
