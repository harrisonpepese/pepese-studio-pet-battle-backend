import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.model';
import { Model } from 'mongoose';
import { EPetTier } from './enum/petTier.enum';
import { EElementType } from 'pepese-core';
import { Random } from 'src/utils/random.service';
import { EHabitatType } from 'src/common/enum/EHabitat.enum';
import { EFlyingPet, EGroundPet, EWaterPet } from './enum/pet.enum';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
  ) {}

  async getbyId(id: string): Promise<Pet> {
    return await this.petModel.findById(id);
  }
  async listByPlayerId(playerId: string): Promise<Pet[]> {
    return await this.petModel.find({ playerId });
  }
  async create(playerId: string, tier: EPetTier): Promise<PetDocument> {
    const pets = await this.listByPlayerId(playerId);
    if (pets.length >= 10) {
      throw 'Max pet limit reached';
    }
    const habitat = this.getRandomHabitat();
    const selectedName = this.getPetRandomByHabbitat(habitat);
    const pet = await this.petModel.create(
      new Pet({
        name: selectedName,
        habitat,
        elemet: this.getRandomElement(),
        playerId: playerId,
        tier: tier,
      }),
    );
    await pet.save();
    return pet;
  }

  private getRandomElement() {
    const elements = Object.values(EElementType);
    return elements[Random.range(0, elements.length - 1)];
  }

  private getRandomHabitat() {
    const elements = Object.values(EHabitatType);
    return elements[Random.range(0, elements.length - 1)];
  }
  private getPetRandomByHabbitat(habitat: EHabitatType) {
    let elements;
    switch (habitat) {
      case EHabitatType.ground:
        elements = Object.values(EGroundPet);
        return elements[Random.range(0, elements.length - 1)];

      case EHabitatType.water:
        elements = Object.values(EWaterPet);
        return elements[Random.range(0, elements.length - 1)];

      case EHabitatType.flying:
        elements = Object.values(EFlyingPet);
        return elements[Random.range(0, elements.length - 1)];
    }
  }
}
