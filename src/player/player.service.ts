import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { Player, PlayerDocument } from './player.model';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PlayerService {
  constructor(
    @InjectModel(Player.name)
    private readonly playerModel: Model<PlayerDocument>,
  ) {}

  async register(accountId: string) {
    const player = await this.getPlayerByAccountId(accountId);
    if (player) {
      return player;
    }
    return this.playerModel.create({
      accountId,
      pets: [],
      gameCoins: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastLogin: new Date(),
      gameCoin: 0,
      isOnline: false,
    });
  }

  getPlayerByAccountId(accountId: string) {
    return this.playerModel.findOne({ accountId });
  }
}
