import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePositionDto } from './dtos/create-position-dto';
import { User } from '../users/user.entity';
import { CompanyProfilesService } from '../company-profiles/company-profiles.service';
import { updatePosition } from './position-helpers';
import { UpdatePositionDto } from './dtos/update-position-dto';
import { CreateCompanyProfileDto } from '../company-profiles/dtos/create-company-profile-dto';
import { SectorsService } from '../sectors/sectors.service';
import { IndustriesService } from '../industries/industries.service';

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position) private repo: Repository<Position>,
    private companyProfilesService: CompanyProfilesService,
    private sectorsService: SectorsService,
    private industriesService: IndustriesService,
  ) {}

  async create(positionDto: CreatePositionDto, user: User) {
    positionDto.user = user;

    let companyProfile = await this.companyProfilesService.findBySymbol(
      positionDto.symbol,
    );
    if (!companyProfile) {
      companyProfile = await this.companyProfilesService.create(positionDto);
    }
    positionDto.companyProfileId = companyProfile.id;

    let sector = companyProfile.sector
      ? await this.sectorsService.find(companyProfile.sector)
      : null;

    if (!sector) {
      sector = await this.sectorsService.create(companyProfile.sector);
    }
    let industry = companyProfile.industry
      ? await this.industriesService.find(companyProfile.industry)
      : null;

    if (!industry) {
      industry = await this.industriesService.create(
        companyProfile.industry,
        sector,
      );
    }

    positionDto.industryId = industry.id;

    try {
      const position = this.repo.create(positionDto);
      return this.repo.save(position);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create position for UserId: ${user.id}, positionDto: ${positionDto}`,
      );
    }
  }

  async insertMultiple(positionDtos: CreatePositionDto[], user: User) {
    const promises = positionDtos.map(async (p) => {
      let companyProfile = await this.companyProfilesService.findBySymbol(
        p.symbol,
      );
      if (!companyProfile) {
        companyProfile = await this.companyProfilesService.create(p);
      }
      p.companyProfileId = companyProfile.id;
      p.user = user;
      return p;
    });

    const modifiedPositionDtos = await Promise.all(promises);
    try {
      const positions = this.repo.create(modifiedPositionDtos);
      await this.repo.insert(positions);
      return positions;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to get positions for userID: ${user.id}`,
      );
    }
  }

  async getUserPositions(userId: number) {
    return await this.repo.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  // return await this.repo.find({
  //   where: { user: { id: userId } },
  //   relations: ['companyProfile'],
  // });

  async findOne(id: number) {
    if (!id) throw new BadRequestException('Invalid Position Id');
    const positions = await this.repo.find({
      where: { id },
      relations: ['user'],
    });

    if (!positions || positions.length <= 0)
      throw new NotFoundException(`Position With ID: ${id} Not Found`);

    return positions[0];
  }

  async updatePositionCompanyProfile(
    position: Position,
    createCompanyProfileDto: CreateCompanyProfileDto,
  ) {
    const companyProfile =
      await this.companyProfilesService.createCustomCompanyProfile(
        createCompanyProfileDto,
      );
    position.companyProfileId = companyProfile.id;
    try {
      return await this.repo.save(position);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update position companyProfile, PositionId: ${position.id}`,
      );
    }
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    if (
      isNaN(id) ||
      !updatePositionDto ||
      typeof updatePositionDto !== 'object'
    ) {
      throw new BadRequestException(
        `Invalid input parameters: Id: ${id}, updatePositionDTO: ${updatePositionDto}`,
      );
    }
    const position = await this.findOne(id);

    position.quantity =
      typeof position.quantity === 'number'
        ? position.quantity
        : Number(position.quantity);
    position.costPerShare =
      typeof position.costPerShare === 'number'
        ? position.costPerShare
        : Number(position.costPerShare);

    const updatedPosition = updatePosition(position, updatePositionDto);
    Object.assign(position, updatedPosition);
    try {
      return await this.repo.save(position);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to update position, ID: ${id}`,
      );
    }
  }

  async remove(id: number) {
    const position = await this.findOne(id);
    return this.repo.remove(position);
  }
}
