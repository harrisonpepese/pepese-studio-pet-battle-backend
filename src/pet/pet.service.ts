import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Pet, PetDocument } from './pet.model';
import { Model } from 'mongoose';

@Injectable()
export class PetService {
  constructor(
    @InjectModel(Pet.name)
    private readonly petModel: Model<PetDocument>,
  ) {}
}
