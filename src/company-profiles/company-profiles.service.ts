import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
    //assume the company profile doesn't exist - yes, because we will check if it exists prior to creating
    // find one with fmps
    const profile = await this.financialPrepModelingService.getCompanyProfile(
      positionDto.symbol,
    );
    // if fmps doesn't have one, we need to provide a custom one where user or maybe admin will create later
    // or user creates, and we add custom flag to companyProfile, and user can choose if they want ones that have been created or opt for a new one
    //so for now we'll provide a default

    // but if user is going to create it, company profile can't be global/ belong to everyone.

    // for now we'll assume admins create it
    if (!profile) {
      return this.getDefaultProfile();
    }

    const sector =
      profile.sector === '' || !profile.sector
        ? 'Default Sector'
        : profile.sector;
    const industry =
      profile.industry === '' || !profile.industry
        ? 'Default Industry'
        : profile.industry;

    const companyProfile: Partial<CompanyProfile> = {
      symbol: profile.symbol,
      companyName: profile.companyName,
      price: profile?.price || 0,
      industry: industry,
      sector: sector,
      country: profile?.country,
    };
    try {
      this.repo.create(companyProfile);
      return await this.repo.save(companyProfile);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create company profile for position: ${positionDto}`,
      );
    }
  }

  async findBySymbol(symbol: string) {
    const companyProfiles = await this.repo.find({ where: { symbol } });
    if (companyProfiles && companyProfiles.length > 0)
      return companyProfiles[0];
    return null;
  }

  createCustomCompanyProfile = async (
    createCompanyProfileDto: CreateCompanyProfileDto,
  ) => {
    try {
      const companyProfile: Partial<CompanyProfile> = {
        symbol: createCompanyProfileDto.symbol,
        companyName: createCompanyProfileDto.companyName,
        price: createCompanyProfileDto?.price || 0,
        industry: createCompanyProfileDto.industry,
        sector: createCompanyProfileDto.sector,
        country: createCompanyProfileDto?.country,
        isCustomProfile: true,
      };
      this.repo.create(companyProfile);

      return await this.repo.save(companyProfile);
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create custom company profile: ${createCompanyProfileDto}`,
      );
    }
  };

  getDefaultProfile = async () => {
    // this should always return a default profile except on the first run
    try {
      const defaultProfile = await this.findBySymbol('default');

      if (!defaultProfile) {
        const newDefaultProfile = this.repo.create({
          symbol: 'default',
          companyName: 'custom profile required',
          price: 0,
          sector: 'Default Sector',
          industry: 'Default Industry',
        });
        return await this.repo.save(newDefaultProfile);
      }
      return defaultProfile;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create default company profile',
      );
    }
  };
}
