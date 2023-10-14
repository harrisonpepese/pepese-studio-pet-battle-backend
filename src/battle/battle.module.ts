import { Module } from '@nestjs/common';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { PetModule } from 'src/pet/pet.module';
import { PlayerModule } from 'src/player/player.module';
import { BattleGateway } from './battle.gateway';

@Module({
  imports: [PetModule, PlayerModule],
  providers: [BattleService, BattleGateway],
  controllers: [BattleController],
})
export class BattleModule {}
