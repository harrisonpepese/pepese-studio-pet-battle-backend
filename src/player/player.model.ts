import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { IBattlePetGamePlayer, IPet } from 'pepese-core';
import { Pet } from 'src/pet/pet.model';

export type PlayerDocument = Player & Document;

@Schema()
export class Player implements IBattlePetGamePlayer {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Pet' })
  pets: IPet[];
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

  addPet(pet: IPet) {
    this.pets.push(pet);
  }
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.loadClass(Player);
