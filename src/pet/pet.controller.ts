import { Body, Controller, Post, Req } from '@nestjs/common';
import { PetService } from './pet.service';
import { PlayerService } from 'src/player/player.service';
import { CreatePetDto } from './dto/createPet.dto';

@Controller('pet')
export class PetController {
  constructor(
    private readonly petService: PetService,
    private readonly playerService: PlayerService,
  ) {}
  @Post()
  async create(@Req() req: any, @Body() dto: CreatePetDto) {
    const playerId = await this.getPlayerId(req);
    const pet = await this.petService.create(playerId, dto.tier);
    return pet;
  }

  private async getPlayerId(req: any) {
    const { playerId } = req.user;
    if (!playerId) {
      throw 'Player not found';
    }
    return playerId;
  }
}
