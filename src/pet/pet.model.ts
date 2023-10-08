import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EElementType, EHabitatType, IPet } from 'pepese-core';
import { PetAttributes } from './class/petAttributes.class';

export type PetDocument = Pet & Document;
export type IPetProps = Pick<Pet, 'name' | 'habitat' | 'elemet'>;
@Schema()
export class Pet {
  constructor() {
    this.level = 1;
    this.created_at = new Date();
    this.updated_at = new Date();
  }
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  habitat: EHabitatType;
  @Prop()
  elemet: EElementType;
  @Prop({ default: 1 })
  level: number;
  @Prop()
  baseAttributes: PetAttributes;
  @Prop()
  currentAttributes: PetAttributes;
  @Prop()
  attributePoints: number;
  @Prop()
  experience: number;
  @Prop()
  created_at: Date;
  @Prop()
  updated_at: Date;
}

export const PetSchema = SchemaFactory.createForClass(Pet);
PetSchema.loadClass(Pet);
