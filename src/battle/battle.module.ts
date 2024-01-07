import { Module } from '@nestjs/common';
import { BattleService } from './battle.service';
import { BattleController } from './battle.controller';
import { BattleGateway } from './battle.gateway';
import { PetModule } from '../pet/pet.module';
import { PlayerModule } from '../player/player.module';

@Module({
  imports: [PetModule, PlayerModule],
  providers: [BattleService, BattleGateway],
  controllers: [BattleController],
})
export class BattleModule {}
