import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { CompanyProfile } from '../company-profiles/company-profile.entity';
import { CompanyProfilesService } from '../company-profiles/company-profiles.service';

@Module({
  imports: [TypeOrmModule.forFeature([Position, CompanyProfile])],
  controllers: [PositionsController],
  providers: [PositionsService, CompanyProfilesService],
})
export class PositionsModule {}
