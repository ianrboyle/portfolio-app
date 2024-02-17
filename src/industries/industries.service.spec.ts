import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { NotFoundException } from '@nestjs/common';
import { IndustriesService } from './industries.service';
import { Industry } from './industries.entity';
import { Sector } from '../sectors/sector.entity';

describe('IndustriesService', () => {
  let service: IndustriesService;
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
        IndustriesService,
        {
          provide: getRepositoryToken(Industry),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<IndustriesService>(IndustriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new industry', async () => {
    const industryName = 'test industry';
    const testSector: Sector = {
      id: 1,
      sectorName: 'test sector',
      industries: [],
    };
    const testIndustry: Industry = {
      id: 1,
      industryName: industryName,
      sector: testSector,
    };
    mockRepository.create.mockReturnValue(testIndustry);
    mockRepository.save.mockReturnValue(testIndustry);

    const industry = await service.create(industryName, testSector);

    expect(industry.sector.sectorName).toEqual(testSector.sectorName);
    expect(industry.industryName).toEqual(testIndustry.industryName);
  });

  it('find should get a industry with industryName "test industry"', async () => {
    const industryName = 'test industry';
    mockRepository.find.mockReturnValue([
      {
        id: 1,
        industryName: industryName,
        sector: new Sector(),
      },
    ]);

    const industry = await service.find('test industry');

    expect(industry.industryName).toEqual(industryName);
  });

  it('find should return null', async () => {
    mockRepository.find.mockReturnValue([]);

    const industry = await service.find('string');

    expect(industry).toBeNull();
  });
  it('findOne should return a industry', async () => {
    const industryName = 'test industry';
    mockRepository.findOneBy.mockReturnValue({
      id: 1,
      industryName: industryName,
      industries: [],
    });

    const industry = await service.findOne(1);

    expect(industry.id).toEqual(1);
  });

  it('findOne should throw a not found', async () => {
    mockRepository.findOneBy.mockReturnValue(null);
    const exception = new NotFoundException(`Industry With ID: 1 Not Found`);
    await expect(service.findOne(1)).rejects.toThrow(exception);
  });
});
