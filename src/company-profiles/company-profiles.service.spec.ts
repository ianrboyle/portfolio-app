import { Test, TestingModule } from '@nestjs/testing';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfile } from './company-profile.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockCreatePositionDtoOne } from '../mock-data/mock-position-data';
import { mockCompanyProfileDataOne } from '../mock-data/mock-company-profile-data';
import { FinancialModelingPrepService } from '../financialModelingPrep/financial-modeling-prep.service';
import { mockStockData } from '../mock-data/mock-profile-data';
import { Profile } from '../financialModelingPrep/models/profile';
import { CreateCompanyProfileDto } from './dtos/create-company-profile-dto';

describe('CompanyProfilesService', () => {
  let service: CompanyProfilesService;
  let mockRepository: Record<string, jest.Mock>;
  let fakeFMPService: Partial<FinancialModelingPrepService>;
  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };

    fakeFMPService = {
      getCompanyProfile: (symbol: string) => {
        if (symbol != 'default') {
          return Promise.resolve(mockStockData[0]);
        }
        return null;
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyProfilesService,
        {
          provide: getRepositoryToken(CompanyProfile),
          useValue: mockRepository,
        },
        {
          provide: FinancialModelingPrepService,
          useValue: fakeFMPService,
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

  it('create should create and return a default profile', async () => {
    fakeFMPService.getCompanyProfile = () => Promise.resolve(null as Profile);

    mockRepository.create.mockReturnValue({
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
    });
    mockRepository.save.mockReturnValue({
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
    });

    const profile = await service.create(mockCreatePositionDtoOne);

    expect(profile.companyName).toEqual('custom profile required');
  });

  it('create should return a default profile', async () => {
    fakeFMPService.getCompanyProfile = () => Promise.resolve(null as Profile);

    mockRepository.find.mockReturnValue([
      {
        symbol: 'default',
        companyName: 'custom profile required',
        price: 0,
      },
    ]);

    const profile = await service.create(mockCreatePositionDtoOne);

    expect(profile.companyName).toEqual('custom profile required');
  });

  it('create should create a new custom profile', async () => {
    const createCompanyProfileDto: CreateCompanyProfileDto = {
      symbol: 'custom',
      industry: 'industry',
      sector: 'sector',
      companyName: 'custom',
      price: 10,
      country: 'country',
      isCustomProfile: false,
    };
    mockRepository.create.mockReturnValue({
      symbol: 'custom',
      industry: 'industry',
      sector: 'sector',
      companyName: 'custom',
      price: 10,
      country: 'country',
    });
    mockRepository.save.mockReturnValue({
      symbol: 'custom',
      industry: 'industry',
      sector: 'sector',
      companyName: 'custom',
      price: 10,
      country: 'country',
    });

    const profile = await service.createCustomCompanyProfile(
      createCompanyProfileDto,
    );

    expect(profile.symbol).toEqual('custom');
  });
});
