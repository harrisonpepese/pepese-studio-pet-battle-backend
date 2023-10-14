import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.model';
import { Model } from 'mongoose';
import { PlayerService } from 'src/player/player.service';
import { EPetTier } from './enum/petTier.enum';
import { EElementType, EHabitatType } from 'pepese-core';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
    private readonly playerService: PlayerService,
  ) {}

  async getbyId(id: string): Promise<Pet> {
    return await this.petModel.findById(id);
  }
  async create(playerId: string, tier: EPetTier): Promise<PetDocument> {
    const player = await this.playerService.getById(playerId);
    if (!player) {
      throw 'Player not found';
    }
    if (player.pets.length >= 10) {
      throw 'You can not have more than 10 pets';
    }
    const pet = await this.petModel.create(
      new Pet({
        name: 'samsungo',
        habitat: EHabitatType.ground,
        elemet: EElementType.none,
      }),
    );
    player.pets.push(pet);
    await player.save();
    return pet;
  }
}
