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
import { CreatePositionDto } from '../positions/dtos/create-position-dto';

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

    const profile = await service.create(mockCreatePositionDtoOne.symbol);

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

    const profile = await service.create(mockCreatePositionDtoOne.symbol);

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

    const profile = await service.create(mockCreatePositionDtoOne.symbol);

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

  it('should create a company profile with default sector and industry when profile sector and industry are empty', async () => {
    // Mocking the financialPrepModelingService
    fakeFMPService.getCompanyProfile = () => {
      // Creating a profile with a non-null, non-empty sector
      const profile: Profile = {
        symbol: 'FAKE',
        price: 10,
        beta: 0,
        volAvg: 0,
        mktCap: 0,
        lastDiv: 0,
        range: '',
        changes: 0,
        companyName: '',
        currency: '',
        cik: '',
        isin: '',
        cusip: '',
        exchange: '',
        exchangeShortName: '',
        industry: '',
        website: '',
        description: '',
        ceo: '',
        sector: '',
        country: 'USA',
        fullTimeEmployees: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        dcfDiff: 0,
        dcf: 0,
        image: '',
        ipoDate: '',
        defaultImage: false,
        isEtf: false,
        isActivelyTrading: false,
        isAdr: false,
        isFund: false,
      };

      return Promise.resolve(profile);
    };

    // Creating a company profile DTO with symbol 'FAKE'
    const createCompanyProfileDto: CreatePositionDto = {
      symbol: 'FAKE',
      quantity: 0,
      costPerShare: 0,
      companyProfileId: 0,
      industryId: 0,
    };

    // Mocking the repository
    mockRepository.create.mockImplementation((data) => data);
    mockRepository.save.mockImplementation((data) => data);

    // Creating the service and calling the create method
    const profile = await service.create(createCompanyProfileDto.symbol);

    expect(profile).toBeDefined();
    expect(profile.sector).toBe('Default Sector');
    expect(profile.industry).toBe('Default Industry');
  });

  it('should create a company profile with default sector and industry when profile sector and industry are null ', async () => {
    // Mocking the financialPrepModelingService
    fakeFMPService.getCompanyProfile = () => {
      // Creating a profile with a non-null, non-empty sector
      const profile: Profile = {
        symbol: 'FAKE',
        price: 10,
        beta: 0,
        volAvg: 0,
        mktCap: 0,
        lastDiv: 0,
        range: '',
        changes: 0,
        companyName: '',
        currency: '',
        cik: '',
        isin: '',
        cusip: '',
        exchange: '',
        exchangeShortName: '',
        industry: null,
        website: '',
        description: '',
        ceo: '',
        sector: null,
        country: 'USA',
        fullTimeEmployees: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        dcfDiff: 0,
        dcf: 0,
        image: '',
        ipoDate: '',
        defaultImage: false,
        isEtf: false,
        isActivelyTrading: false,
        isAdr: false,
        isFund: false,
      };

      return Promise.resolve(profile);
    };

    // Creating a company profile DTO with symbol 'FAKE'
    const createCompanyProfileDto: CreatePositionDto = {
      symbol: 'FAKE',
      quantity: 0,
      costPerShare: 0,
      companyProfileId: 0,
      industryId: 0,
    };

    // Mocking the repository
    mockRepository.create.mockImplementation((data) => data);
    mockRepository.save.mockImplementation((data) => data);

    // Creating the service and calling the create method
    const profile = await service.create(createCompanyProfileDto.symbol);

    expect(profile).toBeDefined();
    expect(profile.sector).toBe('Default Sector');
    expect(profile.industry).toBe('Default Industry');
  });

  it('should return a default company profile', async () => {
    mockRepository.find.mockReturnValue(null);
    const expectedDefaultProfile: CompanyProfile = {
      symbol: 'default',
      companyName: 'custom profile required',
      price: 0,
      sector: 'Default Sector',
      industry: 'Default Industry',
      id: 1,
      country: '',
      isCustomProfile: false,
    };

    mockRepository.create.mockReturnValue(expectedDefaultProfile);
    mockRepository.save.mockReturnValue(expectedDefaultProfile);
    const defaultProfile = await service.getDefaultProfile();

    expect(defaultProfile).toBeDefined();
    expect(defaultProfile.sector).toEqual('Default Sector');
    expect(defaultProfile).toBeDefined();
  });
});
