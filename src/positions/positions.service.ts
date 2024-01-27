import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getUserPositions(userId: number) {
    return await this.repo.find({ where: { user: { id: userId } } });
  }

  findOne(id: number) {
    if (!id) return null;
    return this.repo.findOneBy({ id });
  }

  async update(id: number, updatePositionDto: UpdatePositionDto) {
    const position = await this.findOne(id);
    if (!position) {
      throw new NotFoundException('position not found');
    }
    position.quantity = Number(position.quantity);
    position.costPerShare = Number(position.costPerShare);
    const updatedPosition = updatePosition(position, updatePositionDto);

    Object.assign(position, updatedPosition);
    return this.repo.save(position);
  }
}
