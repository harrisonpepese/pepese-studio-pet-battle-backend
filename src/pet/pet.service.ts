import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.model';
import { Model } from 'mongoose';
import { PlayerService } from 'src/player/player.service';
import { RamdonService } from 'src/common/ramdon.service';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
    private readonly playerService: PlayerService,
    private readonly ramdon: RamdonService,
  ) {}

  async getbyId(id: string): Promise<Pet> {
    return await this.petModel.findById(id);
  }
  async create(playerId: string, name: string): Promise<Pet> {
    const player = await this.playerService.getById(playerId);
    if (!player) {
      throw 'Player not found';
    }
    const pet = new Pet();
    const pet = new this.petModel({ name });
    return await pet.save();
  }
}
