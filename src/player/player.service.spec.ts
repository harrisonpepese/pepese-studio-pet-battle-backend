import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getModelToken } from '@nestjs/mongoose';
import { Player } from 'pepese-core/dist/player/class';
import { mockModel } from '../common/mock/model.mock';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Player.name),
          useValue: mockModel,
        },
        PlayerService,
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
