import { Injectable } from '@nestjs/common';
import { CompanyProfile } from './company-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from '../positions/dtos/create-position-dto';

@Injectable()
export class CompanyProfilesService {
  constructor(
    @InjectRepository(CompanyProfile) private repo: Repository<CompanyProfile>,
  ) {}

  async create(positionDto: CreatePositionDto) {
    const companyProfile = {
      symbol: positionDto.symbol,
      price: 10,
    };
    this.repo.create(companyProfile);

    return await this.repo.save(companyProfile);
  }

  async findBySymbol(symbol: string) {
    const companyProfiles = await this.repo.find({ where: { symbol } });
    return companyProfiles.length > 0 ? companyProfiles[0] : null;
  }
}
