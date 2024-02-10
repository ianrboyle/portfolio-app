import { Injectable } from '@nestjs/common';
import { CompanyProfile } from './company-profile.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePositionDto } from '../positions/dtos/create-position-dto';
import { FinancialModelingPrepService } from '../financialModelingPrep/financial-modeling-prep.service';
import { CreateCompanyProfileDto } from './dtos/create-company-profile-dto';

@Injectable()
export class CompanyProfilesService {
  constructor(
    @InjectRepository(CompanyProfile) private repo: Repository<CompanyProfile>,

    private financialPrepModelingService: FinancialModelingPrepService,
  ) {}

  async create(positionDto: CreatePositionDto) {
    //assume the company profile doesn't exist?
    // find one with fmp
    const profile = await this.financialPrepModelingService.getCompanyProfile(
      positionDto.symbol,
    );
    // if fmp doesn't have one, we need to provide a custom one where user or maybe admin will create later
    //so for now we'll provide a default

    // but if user is going to create it, company profile can't be global/ belong to everyone.

    // for now we'll assume admins create it
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
    return companyProfiles && companyProfiles.length > 0
      ? companyProfiles[0]
      : null;
  }

  createCustomCompanyProfile = async (
    createCompanyProfileDto: CreateCompanyProfileDto,
  ) => {
    const companyProfile: Partial<CompanyProfile> = {
      symbol: createCompanyProfileDto.symbol,
      companyName: createCompanyProfileDto.companyName,
      price: createCompanyProfileDto?.price || 0,
      industry: createCompanyProfileDto.industry,
      sector: createCompanyProfileDto.sector,
      country: createCompanyProfileDto?.country,
    };
    this.repo.create(companyProfile);

    return await this.repo.save(companyProfile);
  };

  getDefaultProfile = async () => {
    // this should always return a default profile except on the first run
    const defaultProfile = await this.findBySymbol('default');
    if (!defaultProfile) {
      const newDefaultProfile = this.repo.create({
        symbol: 'default',
        companyName: 'custom profile required',
        price: 0,
      });
      return await this.repo.save(newDefaultProfile);
    }
    return defaultProfile;
  };
}
