import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Pet } from 'pepese-core/dist/pets/class';
import { PetSchema } from 'pepese-core/dist/pets/schema';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pet.name, schema: PetSchema }]),
    PlayerModule,
  ],
  controllers: [PetController],
  providers: [PetService],
  exports: [PetService],
})
export class PetModule {}
