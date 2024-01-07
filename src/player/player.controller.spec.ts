import { Test, TestingModule } from '@nestjs/testing';
import { PlayerController } from './player.controller';
import { PlayerService } from './player.service';
import { getModelToken } from '@nestjs/mongoose';
import { Player } from 'pepese-core/dist/player/class';
import { mockModel } from '../common/mock/model.mock';

describe('PlayerController', () => {
  let controller: PlayerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerController],
      providers: [
        PlayerService,
        {
          provide: getModelToken(Player.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    controller = module.get<PlayerController>(PlayerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
