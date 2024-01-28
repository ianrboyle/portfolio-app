import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { CompanyProfile } from '../company-profiles/company-profile.entity';
import { CompanyProfilesService } from '../company-profiles/company-profiles.service';
import { FinancialModelingPrepService } from '../financialModelingPrep/financial-modeling-prep.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, CompanyProfile]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [PositionsController],
  providers: [
    PositionsService,
    CompanyProfilesService,
    FinancialModelingPrepService,
  ],
})
export class PositionsModule {}
