import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfile } from './company-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('CompanyProfilesService', () => {
  let service: CompanyProfilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    }).compile();

    service = module.get<CompanyProfilesService>(CompanyProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
