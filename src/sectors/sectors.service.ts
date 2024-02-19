import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { Sector } from './sector.entity';
import {
  GroupValues,
  GroupValuesFactory,
  IndustryGroupValue,
  PositionGroupValue,
  PositionSqlQueryResult,
  SectorGroupValue,
  SectorGroups,
} from './dtos/sector-dto';

@Injectable()
export class SectorsService {
  constructor(@InjectRepository(Sector) private repo: Repository<Sector>) {}

  create(sectorName: string) {
    const sector = this.repo.create({ sectorName });
    return this.repo.save(sector);
  }

  async findOne(id: number) {
    if (!id) throw new BadRequestException(`Invalid Sector Id: ${id}`);

    const sector = await this.repo.findOneBy({ id });

    if (!sector) throw new NotFoundException(`Sector With ID: ${id} Not Found`);

    return sector;
  }

  async find(sectorName: string) {
    const sectors = await this.repo.find({ where: { sectorName } });

    return !sectors || sectors.length <= 0 ? null : sectors[0];
  }

  async getUserSectors(userId: number) {
    const result = await this.getPositionQueryResult(userId);

    const mappedQueryResult: PositionSqlQueryResult[] =
      this.mapPositionQueryResult(result);

    const sectorGroups = this.mapSectorGroups(mappedQueryResult);

    return sectorGroups;
  }

  async getPositionQueryResult(userId: number) {
    return await this.repo
      .createQueryBuilder('sector')
      .innerJoin('industry', 'i', '"i"."sectorId" = "sector"."id"')
      .innerJoin('position', 'p', '"p"."industryId" = "i"."id"')
      .innerJoin('company_profile', 'c', 'c."symbol" = "p"."symbol"')
      .addSelect('"sector"."id" AS "sectorId"')
      .addSelect('"sector"."sectorName" AS "sectorName"')
      .addSelect('"i"."industryName"')
      .addSelect('"p"."symbol"')
      .addSelect('(p."quantity" * c."price") AS "currentValue"')
      .addSelect('p.id AS "positionId"')
      .addSelect('i.id AS "industryId"')
      .addSelect('c."companyName" AS "companyName"')
      .addSelect('(p."quantity" * p."costPerShare") AS "totalCostBasis"')
      .where('"p"."userId" = :userId', { userId: userId })
      .getRawMany();
  }

  async update(id: number, attrs: Partial<Sector>) {
    const sector = await this.findOne(id);

    Object.assign(sector, attrs);
    return this.repo.save(sector);
  }

  async remove(id: number) {
    const sector = await this.findOne(id);
    if (!sector) {
      console.log('error hit');
      throw new NotFoundException('sector Not Found');
    }
    return this.repo.remove(sector);
  }

  mapSectorGroups(result: PositionSqlQueryResult[]) {
    const sectorGroups: SectorGroups = {};
    const groupValuesFactory = this.createGroupValuesFactory();

    for (const position of result) {
      const { sectorGroupValue, industryGroupValue, positionGroupValue } =
        this.getGroupValues(sectorGroups, groupValuesFactory, position);

      this.updateGroupValues(
        sectorGroupValue,
        industryGroupValue,
        positionGroupValue,
        sectorGroups,
        position,
      );
    }

    this.processGroupPercentGain(sectorGroups);

    return sectorGroups;
  }

  processGroupPercentGain(sectorGroups: SectorGroups) {
    for (const sectorName in sectorGroups) {
      const sectorGroupValue = sectorGroups[sectorName];
      this.calculatePercentGain(sectorGroupValue);

      for (const industryName in sectorGroupValue.industries) {
        const industryGroupValue = sectorGroupValue.industries[industryName];
        this.calculatePercentGain(industryGroupValue);

        for (const symbol in industryGroupValue.positions) {
          const positionGroupValue = industryGroupValue.positions[symbol];
          this.calculatePercentGain(positionGroupValue);
        }
      }
    }
  }

  calculatePercentGain(
    groupValue: SectorGroupValue | IndustryGroupValue | PositionGroupValue,
  ) {
    groupValue.percentGain =
      ((groupValue.currentValue - groupValue.totalCostBasis) /
        groupValue.totalCostBasis) *
      100;
  }

  updateGroupValues(
    sectorGroupValue: SectorGroupValue,
    industryGroupValue: IndustryGroupValue,
    positionGroupValue: PositionGroupValue,
    sectorGroups: SectorGroups,
    position: PositionSqlQueryResult,
  ) {
    const { sectorName, industryName, symbol } = position;

    industryGroupValue.positions[symbol] = this.updateGroupValue(
      positionGroupValue,
      position,
    ) as PositionGroupValue;

    sectorGroupValue.industries[industryName] = this.updateGroupValue(
      industryGroupValue,
      position,
    ) as IndustryGroupValue;

    sectorGroups[sectorName] = this.updateGroupValue(
      sectorGroupValue,
      position,
    ) as SectorGroupValue;
  }

  updateGroupValue(
    groupValue: SectorGroupValue | IndustryGroupValue | PositionGroupValue,
    position: PositionSqlQueryResult,
  ) {
    groupValue.currentValue += position.currentValue;
    groupValue.totalCostBasis += position.totalCostBasis;

    if ('companyName' in groupValue) {
      groupValue.companyName = position.companyName;
    }
    return groupValue;
  }

  mapPositionQueryResult(result: PositionSqlQueryResult[]) {
    return result.map((r) => {
      return {
        sectorName: r.sectorName,
        sectorId: r.sectorId,
        industryName: r.industryName,
        currentValue: Number(r.currentValue),
        symbol: r.symbol,
        positionId: r.positionId,
        industryId: r.industryId,
        totalCostBasis: Number(r.totalCostBasis),
        companyName: r.companyName,
      };
    });
  }

  createGroupValuesFactory = (): GroupValuesFactory => {
    return {
      createPositionGroupValue: () => ({
        currentValue: 0,
        companyName: '',
        totalCostBasis: 0,
        percentGain: 0,
      }),
      createIndustryGroupValue: () => ({
        positions: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
      }),
      createSectorGroupValue: () => ({
        industries: {},
        currentValue: 0,
        totalCostBasis: 0,
        percentGain: 0,
      }),
    };
  };

  getGroupValues(
    sectorGroups: SectorGroups,
    groupValuesFactory: GroupValuesFactory,
    position: { sectorName: string; industryName: string; symbol: string },
  ): GroupValues {
    const { sectorName, industryName, symbol } = position;

    // Update or create sectorGroupValue
    sectorGroups[sectorName] =
      sectorGroups[sectorName] || groupValuesFactory.createSectorGroupValue();
    const sectorGroupValue = sectorGroups[sectorName];

    // Update or create industryGroupValue
    sectorGroupValue.industries[industryName] =
      sectorGroupValue.industries[industryName] ||
      groupValuesFactory.createIndustryGroupValue();
    const industryGroupValue = sectorGroupValue.industries[industryName];

    // Update or create positionGroupValue
    industryGroupValue.positions[symbol] =
      industryGroupValue.positions[symbol] ||
      groupValuesFactory.createPositionGroupValue();
    const positionGroupValue = industryGroupValue.positions[symbol];

    return {
      sectorGroupValue,
      industryGroupValue,
      positionGroupValue,
    };
  }
}
