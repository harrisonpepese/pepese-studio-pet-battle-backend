import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

import { Pet } from 'src/pet/pet.model';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Pet.name }],
    default: [],
  })
  pets: Pet[] = [];
  @Prop({ default: 0 })
  gameCoins: number;
  @Prop()
  accountId: string;
  @Prop({ default: Date.now })
  createdAt: Date;
  @Prop({ default: Date.now })
  updatedAt: Date;
  @Prop({ default: Date.now })
  lastLogin: Date;
  @Prop()
  gameCoin: number;
  isOnline: boolean;

  addGameCoin(amount: number) {
    this.gameCoin += amount;
  }

  reduceGameCoin(amount: number) {
    this.gameCoin -= amount;
  }

  addPet(pet: Pet) {
    this.pets.push(pet);
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.loadClass(Player);
