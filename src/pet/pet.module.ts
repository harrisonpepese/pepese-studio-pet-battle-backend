import { Module } from '@nestjs/common';
import { PetController } from './pet.controller';
import { PetService } from './pet.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayerModule } from 'src/player/player.module';
import { Pet } from 'pepese-core/dist/pets/class';
import { PetSchema } from 'pepese-core/dist/pets/schema';

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
