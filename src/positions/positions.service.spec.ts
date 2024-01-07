import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('PositionsService', () => {
  let service: PositionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getRepositoryToken(Position),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
