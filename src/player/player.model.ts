import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema()
export class Player {
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
}

export const PlayerSchema = SchemaFactory.createForClass(Player);
PlayerSchema.loadClass(Player);
