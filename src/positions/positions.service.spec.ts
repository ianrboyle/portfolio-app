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
  mockPositionWithNoCompanyProfile,
} from '../mock-data/mock-position-data';
import { mockUserOne, mockUserTwo } from '../mock-data/mock-user-data';
import {
  mockCompanyProfileDataOne,
  mockCompanyProfileDataTwo,
} from '../mock-data/mock-company-profile-data';
import { UpdatePositionDto } from './dtos/update-position-dto';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCompanyProfileDto } from '../company-profiles/dtos/create-company-profile-dto';

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
      remove: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        innerJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
      })),
    };

    const mockCompanyProfiles: CompanyProfile[] = [mockCompanyProfileDataOne];

    fakeCompanyProfileServce = {
      create: (positionDto: CreatePositionDto) => {
        const companyProfile: CompanyProfile = {
          symbol: positionDto.symbol,
          price: 100,
          id: Math.floor(Math.random() * 99999),
          positions: [],
          companyName: '',
          industry: '',
          sector: '',
          country: '',
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
      createCustomCompanyProfile: (
        createCompanyProfileDto: CreateCompanyProfileDto,
      ) => {
        const companyProfile: CompanyProfile = {
          symbol: createCompanyProfileDto.symbol,
          price: createCompanyProfileDto.price,
          id: Math.floor(Math.random() * 99999),
          positions: [],
          companyName: createCompanyProfileDto.companyName,
          industry: createCompanyProfileDto.industry,
          sector: createCompanyProfileDto.sector,
          country: createCompanyProfileDto.country,
        };

        return Promise.resolve(companyProfile);
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
    mockRepository.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockReturnValue(mockUserOne.positions),
    });

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

  it('should update a position with a positive update quantity', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };

    const updatePositionDto: UpdatePositionDto = {
      updatedCostPerShare: 150,
      updatedQuantity: 5,
    };
    const expectedQuantity =
      mockPosition.quantity + updatePositionDto.updatedQuantity;
    const expectedCostPerShare =
      (mockPosition.costPerShare * mockPosition.quantity +
        updatePositionDto.updatedCostPerShare *
          updatePositionDto.updatedQuantity) /
      expectedQuantity;
    const updatedPosition = {
      ...mockPosition,
      quantity: expectedQuantity,
      costPerShare: expectedCostPerShare,
    };
    mockRepository.findOneBy.mockResolvedValue(mockPosition);
    mockRepository.save.mockResolvedValue(updatedPosition);
    const result = await service.update(mockPosition.id, updatePositionDto);

    // Ensure that the update method returns the expected result
    expect(result).toEqual(updatedPosition);
    expect(result.quantity).toBeGreaterThan(initialQuantity);
    expect(result.costPerShare).toBeGreaterThan(initialCostPerShare);

    expect(mockRepository.save).toHaveBeenCalledWith(mockPosition);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: mockPosition.id,
    });
  });
  it('should update a position with a negative update quantity', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };

    const updatePositionDto: UpdatePositionDto = {
      updatedCostPerShare: 150,
      updatedQuantity: -5,
    };
    const expectedQuantity =
      mockPosition.quantity + updatePositionDto.updatedQuantity;

    const updatedPosition = {
      ...mockPosition,
      quantity: expectedQuantity,
    };
    mockRepository.findOneBy.mockResolvedValue(mockPosition);
    mockRepository.save.mockResolvedValue(updatedPosition);
    const result = await service.update(mockPosition.id, updatePositionDto);

    // Ensure that the update method returns the expected result
    expect(result.quantity).toBeLessThan(initialQuantity);
    expect(result).toEqual(updatedPosition);
    expect(mockRepository.save).toHaveBeenCalledWith(mockPosition);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: mockPosition.id,
    });
  });

  it('should throw InternalServerErrorException on save failure', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };

    const updatePositionDto: UpdatePositionDto = {
      updatedCostPerShare: 150,
      updatedQuantity: 5,
    };
    const errorMessage = 'Simulated error during save';

    const expectedQuantity =
      mockPosition.quantity + updatePositionDto.updatedQuantity;
    const expectedCostPerShare =
      (mockPosition.costPerShare * mockPosition.quantity +
        updatePositionDto.updatedCostPerShare *
          updatePositionDto.updatedQuantity) /
      expectedQuantity;
    const updatedPosition = {
      ...mockPosition,
      quantity: expectedQuantity,
      costPerShare: expectedCostPerShare,
    };
    mockRepository.findOneBy.mockReturnValue(updatedPosition);

    mockRepository.save.mockRejectedValue(new Error(errorMessage));

    await expect(
      service.update(mockPosition.id, updatePositionDto),
    ).rejects.toThrowError(InternalServerErrorException);
    await expect(
      service.update(mockPosition.id, updatePositionDto),
    ).rejects.toThrowError(`Failed to update position, ID: ${mockPosition.id}`);
  });

  it('should throw NotFoundException on position not found', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };

    const updatePositionDto: UpdatePositionDto = {
      updatedCostPerShare: 150,
      updatedQuantity: 5,
    };

    mockRepository.findOneBy.mockReturnValue(null);

    await expect(
      service.update(mockPosition.id, updatePositionDto),
    ).rejects.toThrowError(NotFoundException);
  });

  it('should remove a position', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };
    mockRepository.findOneBy.mockReturnValue(mockPosition);
    await service.remove(mockPosition.id);
    expect(mockRepository.findOneBy).toHaveBeenCalledWith({
      id: mockPosition.id,
    });
    expect(mockRepository.remove).toHaveBeenCalledWith(mockPosition);
  });

  it('remove should  a return a not found exception for no position ', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfile: mockCompanyProfileDataOne,
    };
    mockRepository.findOneBy.mockReturnValue(null);
    await expect(service.remove(mockPosition.id)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should create a custom company profile for a position', async () => {
    const createCompanyProfileDto: CreateCompanyProfileDto = {
      symbol: 'custom',
      industry: 'industry',
      sector: 'sector',
      companyName: 'custom',
      price: 10,
      country: 'country',
    };
    const positionWithCustomProfile = {
      ...mockPositionWithNoCompanyProfile,
      companyProfile: {
        symbol: createCompanyProfileDto.symbol,
        industry: createCompanyProfileDto.industry,
        sector: createCompanyProfileDto.sector,
        price: createCompanyProfileDto.price,
        companyName: createCompanyProfileDto.companyName,
        country: createCompanyProfileDto.country,
        // Add other properties as needed
      },
    };
    mockRepository.save.mockReturnValue(positionWithCustomProfile);

    const updatedPosition = await service.updatePositionCompanyProfile(
      mockPositionWithNoCompanyProfile,
      createCompanyProfileDto,
    );

    const companyProfile = updatedPosition.companyProfile;

    expect(updatedPosition.companyProfile).toBeDefined;
    expect(companyProfile.symbol).toEqual(createCompanyProfileDto.symbol);
  });

  it('should insert multiple positions', async () => {});
});
