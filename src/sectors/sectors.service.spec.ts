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
});
