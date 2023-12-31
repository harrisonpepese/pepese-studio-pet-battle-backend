import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EFlyingPet, EGroundPet, EWaterPet } from './enum/pet.enum';
import { EElementType, EHabitatType } from 'pepese-core/dist/common/enum';
import { Pet } from 'pepese-core/dist/pets/class';
import { EPetTier } from 'pepese-core/dist/pets/enum';
import { PetDocument } from 'pepese-core/dist/pets/schema';
import { Random } from '../utils/random.service';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
  ) {}

  async getbyId(id: string): Promise<Pet> {
    const result = await this.petModel.findById(id);
    const object = result.toObject();
    return new Pet({ ...object, id: object._id.toString() });
  }

  async listByPlayerId(playerId: string): Promise<Pet[]> {
    return await this.petModel.find({ playerId });
  }

  async update(pet: Pet): Promise<void> {
    await this.petModel.updateOne({ _id: pet.id }, { $set: { ...pet } });
  }
  async create(playerId: string, tier: EPetTier): Promise<PetDocument> {
    const pets = await this.listByPlayerId(playerId);
    if (pets.length >= 10) {
      throw 'Max pet limit reached';
    }
    const habitat = this.getRandomHabitat();
    const selectedName = this.getPetRandomByHabbitat(habitat);
    const pet = await this.petModel.create(
      Pet.generate({
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
