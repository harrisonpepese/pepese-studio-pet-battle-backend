import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EElementType, EHabitatType, IPet, IPetAttributes } from 'pepese-core';

export type PetDocument = Pet & Document;

@Schema()
export class Pet implements IPet {
  @Prop()
  id: string;
  @Prop()
  name: string;
  @Prop()
  habitat: EHabitatType;
  @Prop()
  elemet: EElementType;
  @Prop()
  level: number;
  @Prop()
  baseAttributes: IPetAttributes;
  @Prop()
  currentAttributes: IPetAttributes;
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
