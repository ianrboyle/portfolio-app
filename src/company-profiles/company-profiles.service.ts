import { Injectable } from '@nestjs/common';
import { CompanyProfile } from './company-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from '../positions/dtos/create-position-dto';
import { FinancialModelingPrepService } from '../financialModelingPrep/financial-modeling-prep.service';

@Injectable()
export class CompanyProfilesService {
  constructor(
    @InjectRepository(CompanyProfile) private repo: Repository<CompanyProfile>,

    private financialPrepModelingService: FinancialModelingPrepService,
  ) {}

  async create(positionDto: CreatePositionDto) {
    const profile = await this.financialPrepModelingService.getCompanyProfile(
      positionDto.symbol,
    );
    if (!profile) {
      return this.getDefaultProfile();
    }
    const companyProfile: Partial<CompanyProfile> = {
      symbol: profile.symbol,
      companyName: profile.companyName,
      price: profile?.price || 0,
      industry: profile?.industry,
      sector: profile?.sector,
      country: profile?.country,
    };
    this.repo.create(companyProfile);

    return await this.repo.save(companyProfile);
  }

  async findBySymbol(symbol: string) {
    const companyProfiles = await this.repo.find({ where: { symbol } });
    return companyProfiles.length > 0 ? companyProfiles[0] : null;
  }

  createCustomCompanyProfile = async () => {};

  getDefaultProfile = async () => {
    const defaultProfile = await this.findBySymbol('default');
    if (!defaultProfile) {
      const newDefaultProfile = this.repo.create({
        symbol: 'default',
        companyName: 'custom profile required',
        price: 0,
      });
      return this.repo.save(newDefaultProfile);
    }
    return defaultProfile;
  };
}
