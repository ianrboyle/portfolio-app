import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Position } from './position.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePositionDto } from './dtos/create-position-dto';
import { User } from 'src/users/user.entity';

// import { CompanyProfilesService } from 'src/companyProfiles/company-profiles.service';
// import { Sector } from 'src/sectors/sector.entity';
// import { Industry } from 'src/industries/industries.entity';

@Injectable()
export class PositionsService {
  constructor(@InjectRepository(Position) private repo: Repository<Position>) {}

  create(positionDto: CreatePositionDto, user: User) {
    const position = this.repo.create(positionDto);
    position.user = user;

    const companyProfile = null;
    // const companyProfile = this.companyProfilesService.findBySymbol(
    //   position.symbol,
    // );

    if (!companyProfile) {
      //create company profile
      // position.companyProfile = this.mockCompanyProfile(positionDto);
    }
    return this.repo.save(position);
  }

  // mockCompanyProfile(position: CreatePositionDto) {
  //   const sector: Sector = {
  //     id: 1,
  //     sectorName: 'Tech',
  //     companyProfile: new CompanyProfile(),
  //     industries: [],
  //   };

  //   const industry: Industry = {
  //     id: 1,
  //     industryName: 'Electronics',
  //     sector: sector,
  //     companyProfile: new CompanyProfile(),
  //   };
  //   sector.industries.push(industry);

  //   const companyProfile: CompanyProfile = {
  //     id: 1,
  //     symbol: position.symbol,
  //     price: 13.12,
  //     country: 'USA',
  //     sector: null,
  //     industry: null,
  //     companyName: 'Apple',
  //     // position: new Position(),
  //   };

  //   sector.companyProfile = companyProfile;
  //   industry.companyProfile = companyProfile;
  //   companyProfile.sector = sector;
  //   companyProfile.industry = industry;

  //   return companyProfile;
  // }
}
