import { Test, TestingModule } from '@nestjs/testing';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { CompanyProfilesService } from '../company-profiles/company-profiles.service';
import { CompanyProfile } from '../company-profiles/company-profile.entity';

describe('PositionsController', () => {
  let controller: PositionsController;

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
        CompanyProfilesService,
        {
          provide: getRepositoryToken(CompanyProfile),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
          },
        },
      ],
      controllers: [PositionsController],
    }).compile();

    controller = module.get<PositionsController>(PositionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
