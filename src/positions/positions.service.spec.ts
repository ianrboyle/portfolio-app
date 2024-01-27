import { Test, TestingModule } from '@nestjs/testing';
import { PositionsService } from './positions.service';
import { Position } from './position.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyProfilesService } from '../company-profiles/company-profiles.service';
import { CompanyProfile } from '../company-profiles/company-profile.entity';
import { CreatePositionDto } from './dtos/create-position-dto';
import {
  mockCreatePositionDtoOne,
  mockCreatePositionDtoTwo,
  mockPosition1,
  mockPosition2,
} from '../mock-data/mock-position-data';
import { mockUserOne, mockUserTwo } from '../mock-data/mock-user-data';
import {
  mockCompanyProfileDataOne,
  mockCompanyProfileDataTwo,
} from '../mock-data/mock-company-profile-data';

describe('PositionsService', () => {
  let service: PositionsService;
  let mockRepository: Record<string, jest.Mock>;
  let fakeCompanyProfileServce: Partial<CompanyProfilesService>;
  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
    };

    const mockCompanyProfiles: CompanyProfile[] = [mockCompanyProfileDataOne];

    fakeCompanyProfileServce = {
      create: (positionDto: CreatePositionDto) => {
        const companyProfile: CompanyProfile = {
          symbol: positionDto.symbol,
          price: 100,
          id: Math.floor(Math.random() * 99999),
          positions: [],
        };
        mockCompanyProfiles.push(companyProfile);
        return Promise.resolve(companyProfile);
      },
      findBySymbol: (symbol: string) => {
        const filteredProfiles = mockCompanyProfiles.filter(
          (c) => c.symbol === symbol,
        );
        const returnedProfile =
          filteredProfiles.length > 0 ? filteredProfiles[0] : null;
        return Promise.resolve(returnedProfile);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PositionsService,
        {
          provide: getRepositoryToken(Position),
          useValue: mockRepository,
        },
        {
          provide: CompanyProfilesService,
          useValue: fakeCompanyProfileServce,
        },
      ],
    }).compile();

    service = module.get<PositionsService>(PositionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should create a new position', async () => {
    const createdPosition = mockPosition1;
    mockRepository.create.mockReturnValue(createdPosition);
    createdPosition.user = mockUserOne;

    createdPosition.companyProfile = mockCompanyProfileDataOne;

    mockRepository.save.mockReturnValue(createdPosition);

    const position = await service.create(
      mockCreatePositionDtoOne,
      mockUserOne,
    );

    expect(position.user).toEqual(mockUserOne);
    expect(position.symbol).toEqual(mockPosition1.symbol);
    expect(position.companyProfile.symbol).toEqual(
      mockCompanyProfileDataOne.symbol,
    );
  });
  it('should create a new position where findBySymbol returns null', async () => {
    const createdPosition = mockPosition2;
    mockRepository.create.mockReturnValue(createdPosition);
    createdPosition.user = mockUserTwo;

    createdPosition.companyProfile = mockCompanyProfileDataTwo;

    mockRepository.save.mockReturnValue(createdPosition);

    const position = await service.create(
      mockCreatePositionDtoTwo,
      mockUserTwo,
    );

    expect(position.user).toEqual(mockUserTwo);
    expect(position.symbol).toEqual(mockPosition2.symbol);
    expect(position.companyProfile.symbol).toEqual(
      mockCompanyProfileDataTwo.symbol,
    );
  });

  it('should return a users positions', async () => {
    mockUserOne.positions.push(mockPosition1);
    mockRepository.find.mockReturnValue(mockUserOne.positions);

    const positions = await service.getUserPositions(mockUserOne.id);

    expect(positions).toContain(mockPosition1);
  });

  it('should return a position by id', async () => {
    mockRepository.findOneBy.mockReturnValue(mockPosition1);

    const position = service.findOne(mockPosition1.id);

    expect(position).toEqual(mockPosition1);
  });

  it('should return a not found exception for findOne', async () => {
    mockRepository.findOneBy.mockReturnValue(null);

    const position = service.findOne(mockPosition1.id);

    expect(position).toEqual(null);
  });
  it('should update a position', async () => {
    mockRepository.findOneBy.mockReturnValue(null);

    const position = service.findOne(mockPosition1.id);

    expect(position).toEqual(null);
  });
  it('should return a not found exception for findOne', async () => {
    mockRepository.findOneBy.mockReturnValue(null);

    const position = service.findOne(mockPosition1.id);

    expect(position).toEqual(null);
  });
});
