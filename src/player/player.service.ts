import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Player } from 'pepese-core/dist/player/class';
import { PlayerDocument } from 'pepese-core/dist/player/schema';

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

  getById(id: string) {
    return this.playerModel.findById(id);
  }
}
