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

@Injectable()
export class PositionsService {
  constructor(
    @InjectRepository(Position) private repo: Repository<Position>,
    private companyProfilesService: CompanyProfilesService,
  ) {}

  async create(positionDto: CreatePositionDto, user: User) {
    const position = this.repo.create(positionDto);
    position.user = user;

    let companyProfile = await this.companyProfilesService.findBySymbol(
      position.symbol,
    );
    if (!companyProfile) {
      companyProfile = await this.companyProfilesService.create(positionDto);
    }
    position.companyProfile = companyProfile;
    return this.repo.save(position);
  }

  async insertMultiple(positionDtos: CreatePositionDto[], user: User) {
    const promises = positionDtos.map(async (p) => {
      let companyProfile = await this.companyProfilesService.findBySymbol(
        p.symbol,
      );
      if (!companyProfile) {
        companyProfile = await this.companyProfilesService.create(p);
      }
      p.companyProfile = companyProfile;
      p.user = user;
      return p;
    });

    const modifiedPositionDtos = await Promise.all(promises);
    const positions = this.repo.create(modifiedPositionDtos);
    await this.repo.insert(positions);
    return positions;
  }

  async getUserPositions(userId: number) {
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
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
    if (!position) {
      throw new NotFoundException(`Position with ID: ${id} not found`);
    }
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
    if (!position) {
      throw new NotFoundException(`Position with ID: ${id} not found`);
    }
    return this.repo.remove(position);
  }
}
