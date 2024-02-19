import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SectorsService } from './sectors.service';
import { Sector } from './sector.entity';
import { NotFoundException } from '@nestjs/common';

describe('SectorsService', () => {
  let service: SectorsService;
  let mockRepository: Record<string, jest.Mock>;
  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        innerJoin: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        getRawMany: jest.fn(),
      })),
      getRawMany: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SectorsService,
        {
          provide: getRepositoryToken(Sector),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<SectorsService>(SectorsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new sector', async () => {
    const sectorName = 'test sector';
    const testSector: Sector = {
      id: 1,
      sectorName: sectorName,
      industries: [],
    };
    mockRepository.create.mockReturnValue(sectorName);
    mockRepository.save.mockReturnValue(testSector);

    const sector = await service.create(sectorName);

    expect(sector.sectorName).toEqual(sectorName);
  });

  it('find should get a sector with sectorName "test sector"', async () => {
    const sectorName = 'test sector';
    mockRepository.find.mockReturnValue([
      {
        id: 1,
        sectorName: sectorName,
        industries: [],
      },
    ]);

    const sector = await service.find('test sector');

    expect(sector.sectorName).toEqual(sectorName);
  });

  it('find should return null', async () => {
    mockRepository.find.mockReturnValue([]);

    const sector = await service.find('string');

    expect(sector).toBeNull();
  });
  it('findOne should return a sector', async () => {
    const sectorName = 'test sector';
    mockRepository.findOneBy.mockReturnValue({
      id: 1,
      sectorName: sectorName,
      industries: [],
    });

    const sector = await service.findOne(1);

    expect(sector.id).toEqual(1);
  });

  it('findOne should throw a not found', async () => {
    mockRepository.findOneBy.mockReturnValue(null);
    const exception = new NotFoundException(`Sector With ID: 1 Not Found`);
    await expect(service.findOne(1)).rejects.toThrow(exception);
  });

  it('should get an array of PositionSqlQueryResults', async () => {
    mockRepository.createQueryBuilder.mockReturnValue({
      select: jest.fn().mockReturnThis(),
      innerJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockReturnValue([
        {
          sectorId: 1,
          sectorName: 'Technology',
          industryName: 'Software',
          currentValue: 1000,
          symbol: 'AAPL',
          positionId: 1,
          industryId: 1,
          totalCostBasis: 100,
          companyName: 'Apple Inc.',
        },
        {
          sectorId: 2,
          sectorName: 'Energy',
          industryName: 'Oil',
          currentValue: 100,
          symbol: 'BP',
          positionId: 2,
          industryId: 2,
          totalCostBasis: 100,
          companyName: 'BP',
        },
        {
          sectorId: 1,
          sectorName: 'Technology',
          industryName: 'Computers',
          currentValue: 100,
          symbol: 'MSFT',
          positionId: 3,
          industryId: 3,
          totalCostBasis: 100,
          companyName: 'Microsoft',
        },
        {
          sectorId: 1,
          sectorName: 'Technology',
          industryName: 'Software',
          currentValue: 1000,
          symbol: 'SOFT',
          positionId: 4,
          industryId: 1,
          totalCostBasis: 100,
          companyName: 'Software Inc.',
        },
      ]),
    });

    const result = await service.getPositionQueryResult(1);

    expect(result.length).toEqual(4);
    expect(mockRepository.createQueryBuilder).toHaveBeenCalled();
  });

  it;

  it('should test your method', async () => {
    // Example of setting up a mock for createQueryBuilder
    // ...
  });
});
