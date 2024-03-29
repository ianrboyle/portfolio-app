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
import { LoggerService } from '../logger/logger.service';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';
import { Industry } from '../industries/industries.entity';
import { Sector } from '../sectors/sector.entity';

describe('PositionsService', () => {
  let service: PositionsService;
  let mockRepository: Record<string, jest.Mock>;
  let fakeCompanyProfileServce: Partial<CompanyProfilesService>;
  let fakeLoggerService: Partial<LoggerService>;
  let fakeSectorsService: Partial<SectorsService>;
  let fakeIndustriesService: Partial<IndustriesService>;
  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      insert: jest.fn(),
    };

    const mockCompanyProfiles: CompanyProfile[] = [mockCompanyProfileDataOne];

    fakeCompanyProfileServce = {
      create: (symbol: string) => {
        const companyProfile: CompanyProfile = {
          symbol: symbol,
          price: 100,
          id: Math.floor(Math.random() * 99999),
          companyName: '',
          industry: 'Computers and Manufacturing',
          sector: 'Tech',
          country: '',
          isCustomProfile: false,
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
          companyName: createCompanyProfileDto.companyName,
          industry: createCompanyProfileDto.industry,
          sector: createCompanyProfileDto.sector,
          country: createCompanyProfileDto.country,
          isCustomProfile: true,
        };

        return Promise.resolve(companyProfile);
      },
    };

    fakeSectorsService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      create: (sectorName: string) => {
        return Promise.resolve({
          id: 1,
          sectorName: 'Tech',
          industries: [],
        });
      },
      find: () => {
        return Promise.resolve(null);
      },
    };
    fakeIndustriesService = {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      create: (industryName: string) => {
        const industry: Industry = {
          id: 1,
          industryName: 'Computers and Manufacturing',
          sector: new Sector(),
        };
        return Promise.resolve(industry);
      },
      find: () => {
        return Promise.resolve(null);
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
        {
          provide: LoggerService,
          useValue: fakeLoggerService,
        },
        {
          provide: SectorsService,
          useValue: fakeSectorsService,
        },
        {
          provide: IndustriesService,
          useValue: fakeIndustriesService,
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

    createdPosition.companyProfileId = mockCompanyProfileDataOne.id;

    mockRepository.save.mockReturnValue(createdPosition);

    const position = await service.create(
      mockCreatePositionDtoOne,
      mockUserOne,
    );

    expect(position.user).toEqual(mockUserOne);
    expect(position.symbol).toEqual(mockPosition1.symbol);
    expect(position.companyProfileId).toEqual(mockCompanyProfileDataOne.id);
  });
  it('should create a new position where findBySymbol returns null', async () => {
    const createdPosition = mockPosition2;
    mockRepository.create.mockReturnValue(createdPosition);
    createdPosition.user = mockUserTwo;

    createdPosition.companyProfileId = mockCompanyProfileDataTwo.id;

    mockRepository.save.mockReturnValue(createdPosition);

    const position = await service.create(
      mockCreatePositionDtoTwo,
      mockUserTwo,
    );

    expect(position.user).toEqual(mockUserTwo);
    expect(position.symbol).toEqual(mockPosition2.symbol);
    expect(position.companyProfileId).toEqual(mockCompanyProfileDataTwo.id);
  });

  it('should return a users positions', async () => {
    const user = mockUserOne;
    const position = mockPosition1;
    user.positions = [];
    user.positions.push(position);

    mockRepository.find.mockReturnValue(user.positions);

    const positions = await service.getUserPositions(user.id);

    expect(positions).toContain(position);
  });

  it('should return a position by id', async () => {
    const mockPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: 100,
      costPerShare: 30,
      user: {
        id: 1,
        email: '',
        password: '',
        positions: [],
        logInsert: function (): void {
          throw new Error('Function not implemented.');
        },
        logRemove: function (): void {
          throw new Error('Function not implemented.');
        },
        logUpdate: function (): void {
          throw new Error('Function not implemented.');
        },
      },
      companyProfileId: 1,
      industryId: 0,
    };
    mockRepository.find.mockReturnValue([mockPosition]);

    const position = await service.findOne(mockPosition.id);

    expect(position).toEqual(mockPosition);
  });

  it('should return a not found exception for findOne', async () => {
    mockRepository.find.mockReturnValue([]);
    const exception = new NotFoundException(
      `Position With ID: ${mockPosition1.id} Not Found`,
    );
    await expect(service.findOne(mockPosition1.id)).rejects.toThrow(exception);
  });

  it('should update a position with a positive update quantity', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      industryId: 0,
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
    mockRepository.find.mockResolvedValue([mockPosition]);
    mockRepository.save.mockResolvedValue(updatedPosition);
    const result = await service.update(mockPosition.id, updatePositionDto);

    // Ensure that the update method returns the expected result
    expect(result).toEqual(updatedPosition);
    expect(result.quantity).toBeGreaterThan(initialQuantity);
    expect(result.costPerShare).toBeGreaterThan(initialCostPerShare);

    expect(mockRepository.save).toHaveBeenCalledWith(mockPosition);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
      where: {
        id: 1,
      },
    });
  });
  it('should update a position with a negative update quantity', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      industryId: 0,
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
    mockRepository.find.mockResolvedValue([mockPosition]);
    mockRepository.save.mockResolvedValue(updatedPosition);
    const result = await service.update(mockPosition.id, updatePositionDto);

    // Ensure that the update method returns the expected result
    expect(result.quantity).toBeLessThan(initialQuantity);
    expect(result).toEqual(updatedPosition);
    expect(mockRepository.save).toHaveBeenCalledWith(mockPosition);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
      where: {
        id: 1,
      },
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
    mockRepository.find.mockReturnValue([updatedPosition]);

    mockRepository.save.mockRejectedValue(new Error(errorMessage));

    await expect(
      service.update(mockPosition.id, updatePositionDto),
    ).rejects.toThrow(InternalServerErrorException);
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

    mockRepository.find.mockReturnValue([]);

    await expect(
      service.update(mockPosition.id, updatePositionDto),
    ).rejects.toThrow(NotFoundException);
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
    mockRepository.find.mockReturnValue([mockPosition]);
    await service.remove(mockPosition.id);
    expect(mockRepository.find).toHaveBeenCalledWith({
      relations: ['user'],
      where: {
        id: mockPosition.id,
      },
    });
    expect(mockRepository.remove).toHaveBeenCalledWith(mockPosition);
  });

  it('remove should a return a not found exception for no position ', async () => {
    const initialQuantity = 10;
    const initialCostPerShare = 100;
    const mockPosition: Position = {
      id: 1,
      symbol: 'AAPL',
      quantity: initialQuantity,
      costPerShare: initialCostPerShare,
      user: mockUserOne,
      companyProfileId: mockCompanyProfileDataOne.id,
      industryId: 0,
    };
    mockRepository.find.mockReturnValue([]);

    // await expect(service.remove(mockPosition.id)).rejects.toThrowError(
    //   NotFoundException,
    // );
    await expect(service.remove(mockPosition.id)).rejects.toThrow(
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
      isCustomProfile: true,
    };
    const positionWithCustomProfile: Partial<Position> = {
      ...mockPositionWithNoCompanyProfile,
      companyProfileId: 1,
    };
    mockRepository.save.mockReturnValue(positionWithCustomProfile);

    const updatedPosition = await service.updatePositionCompanyProfile(
      mockPositionWithNoCompanyProfile,
      createCompanyProfileDto,
    );

    const companyProfileId = updatedPosition.companyProfileId;

    expect(updatedPosition.companyProfileId).toBeDefined;
    expect(companyProfileId).toEqual(1);
  });

  it('should insert multiple positions', async () => {
    const positionDto: CreatePositionDto = {
      symbol: 'AAPL',
      quantity: 10,
      costPerShare: 50,
      companyProfileId: 0,
      industryId: 0,
    };

    const positionDtos: CreatePositionDto[] = [positionDto];
    // Mock the behavior of findBySymbol and create methods
    jest
      .spyOn(fakeCompanyProfileServce, 'findBySymbol')
      .mockResolvedValue(null);
    jest
      .spyOn(fakeCompanyProfileServce, 'create')
      .mockResolvedValue(mockCompanyProfileDataOne);

    // Mock the behavior of the repository methods
    jest.spyOn(mockRepository, 'create').mockReturnValue(positionDtos);
    jest.spyOn(mockRepository, 'insert').mockResolvedValue(undefined);

    const result = await service.insertMultiple(positionDtos, mockUserOne);

    // Assertions
    expect(fakeCompanyProfileServce.findBySymbol).toHaveBeenCalledTimes(
      positionDtos.length,
    );
    expect(fakeCompanyProfileServce.create).toHaveBeenCalledTimes(
      positionDtos.length,
    );
    expect(mockRepository.create).toHaveBeenCalledWith(positionDtos);
    expect(mockRepository.insert).toHaveBeenCalledWith(positionDtos);
    expect(result).toEqual(positionDtos);
    const mockCompanyId = mockCompanyProfileDataOne.id;
    // expect(result[0].companyProfileId).toEqual(mockCompanyProfileDataOne.id);
    expect(mockCompanyProfileDataOne.id).toEqual(mockCompanyId);
    expect(mockCompanyId).toEqual(result[0].companyProfileId);
  });
  it('should find a sector and industry and create a position with an industry id of 1', async () => {
    const positionDto: CreatePositionDto = {
      symbol: 'FAKE',
      quantity: 10,
      costPerShare: 50,
      companyProfileId: 0,
      industryId: 0,
    };

    jest.spyOn(fakeCompanyProfileServce, 'findBySymbol').mockResolvedValue({
      id: 1,
      symbol: 'FAKE',
      companyName: 'FAKE',
      price: 0,
      industry: 'test sector',
      sector: 'test industry',
      country: 'fake country',
      isCustomProfile: false,
    });

    jest.spyOn(fakeSectorsService, 'find').mockResolvedValue({
      id: 1,
      sectorName: 'test sector',
      industries: [],
    });
    jest.spyOn(fakeIndustriesService, 'find').mockResolvedValue({
      id: 1,
      industryName: 'test industry',
      sector: {
        id: 1,
        sectorName: 'test sector',
        industries: [],
      },
    });

    mockRepository.create.mockImplementation((data) => data);
    mockRepository.save.mockImplementation((data) => data);

    const result = await service.create(positionDto, mockUserOne);

    // Assertions
    expect(fakeCompanyProfileServce.findBySymbol).toHaveBeenCalledTimes(1);
    expect(fakeSectorsService.find).toHaveBeenCalledTimes(1);
    expect(mockRepository.create).toHaveBeenCalledWith(positionDto);
    expect(result.industryId).toEqual(1);
  });

  it('should create an industry when industryService.find returns null', async () => {
    fakeIndustriesService.create = () => {
      const mockIndustry: Industry = {
        id: 1,
        industryName: 'test industry',
        sector: new Sector(),
      };

      return Promise.resolve(mockIndustry);
    };

    const industry = await service.getOrCreateIndustry(
      'test industry',
      new Sector(),
    );

    expect(industry.industryName).toEqual('test industry');
  });

  it('should return an already existing industry', async () => {
    fakeIndustriesService.find = () => {
      const mockIndustry: Industry = {
        id: 1,
        industryName: 'test industry',
        sector: new Sector(),
      };

      return Promise.resolve(mockIndustry);
    };

    jest.spyOn(fakeIndustriesService, 'create');

    const industry = await service.getOrCreateIndustry(
      'test industry',
      new Sector(),
    );
    expect(fakeIndustriesService.create).toHaveBeenCalledTimes(0);
    expect(industry.industryName).toEqual('test industry');
  });
  it('should create a sector when sectorService.find returns null', async () => {
    fakeSectorsService.create = () => {
      const mockSector: Sector = {
        id: 1,
        sectorName: 'test sector',
        industries: [],
      };

      return Promise.resolve(mockSector);
    };

    const sector = await service.getOrCreateSector('test sector');

    expect(sector.sectorName).toEqual('test sector');
  });

  it('should return an already existing sector', async () => {
    fakeSectorsService.find = () => {
      const mockSector: Sector = {
        id: 1,
        sectorName: 'test sector',
        industries: [],
      };

      return Promise.resolve(mockSector);
    };

    jest.spyOn(fakeSectorsService, 'create');

    const sector = await service.getOrCreateSector('test sector');
    expect(fakeSectorsService.create).toHaveBeenCalledTimes(0);
    expect(sector.sectorName).toEqual('test sector');
  });

  it('should create a companyProfile when companyProfiule.find returns null', async () => {
    fakeCompanyProfileServce.findBySymbol = () => {
      return Promise.resolve(null);
    };
    fakeCompanyProfileServce.create = () => {
      const mockCompanyProfile: CompanyProfile = {
        id: 1,
        symbol: 'FAKE',
        companyName: 'test',
        price: 0,
        industry: '',
        sector: '',
        country: '',
        isCustomProfile: false,
      };

      return Promise.resolve(mockCompanyProfile);
    };

    const companyProfile = await service.getOrCreateCompanyProfile('FAKE');

    expect(companyProfile.symbol).toEqual('FAKE');
  });

  it('should return an already existing companyProfile', async () => {
    fakeCompanyProfileServce.findBySymbol = () => {
      const mockCompanyProfile: CompanyProfile = {
        id: 1,
        symbol: 'FAKE',
        companyName: 'test',
        price: 0,
        industry: '',
        sector: '',
        country: '',
        isCustomProfile: false,
      };

      return Promise.resolve(mockCompanyProfile);
    };

    jest.spyOn(fakeCompanyProfileServce, 'create');

    const companyProfile = await service.getOrCreateCompanyProfile('FAKE');
    expect(fakeCompanyProfileServce.create).toHaveBeenCalledTimes(0);
    expect(companyProfile.symbol).toEqual('FAKE');
  });
});
