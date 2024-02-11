import { Module } from '@nestjs/common';
import { CompanyProfilesService } from './company-profiles.service';
import { CompanyProfile } from './company-profile.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { FinancialModelingPrepService } from '../financialModelingPrep/financial-modeling-prep.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CompanyProfile]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [CompanyProfilesService, FinancialModelingPrepService],
  exports: [CompanyProfilesService],
})
export class CompanyProfilesModule {}
