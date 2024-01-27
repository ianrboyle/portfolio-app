import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfile } from './company-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockCreatePositionDtoOne } from '../mock-data/mock-position-data';
import { mockCompanyProfileDataOne } from '../mock-data/mock-company-profile-data';

describe('CompanyProfilesService', () => {
  let service: CompanyProfilesService;
  let mockRepository: Record<string, jest.Mock>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyProfilesService,
        {
          provide: getRepositoryToken(CompanyProfile),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyProfilesService>(CompanyProfilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new companyProfile', async () => {
    mockRepository.create.mockReturnValue(mockCompanyProfileDataOne);
    mockRepository.save.mockReturnValue(mockCompanyProfileDataOne);

    const profile = await service.create(mockCreatePositionDtoOne);

    expect(profile.symbol).toEqual(mockCreatePositionDtoOne.symbol);
  });

  it('findBySymbol should find a companyProfile with symbol AAPL', async () => {
    mockRepository.find.mockReturnValue([mockCompanyProfileDataOne]);

    const profile = await service.findBySymbol(mockCreatePositionDtoOne.symbol);

    expect(profile.symbol).toEqual(mockCreatePositionDtoOne.symbol);
  });

  it('findBySymbol should return null', async () => {
    mockRepository.find.mockReturnValue([]);

    const profile = await service.findBySymbol(mockCreatePositionDtoOne.symbol);

    expect(profile).toBeNull();
  });
});
