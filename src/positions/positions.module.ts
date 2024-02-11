import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { CompanyProfile } from '../company-profiles/company-profile.entity';
import { HttpModule } from '@nestjs/axios';
import { CompanyProfilesModule } from '../company-profiles/company-profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position, CompanyProfile]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CompanyProfilesModule,
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
