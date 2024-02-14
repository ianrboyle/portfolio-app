import { Module } from '@nestjs/common';
import { PositionsController } from './positions.controller';
import { PositionsService } from './positions.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Position } from './position.entity';
import { HttpModule } from '@nestjs/axios';
import { CompanyProfilesModule } from '../company-profiles/company-profiles.module';
import { LoggerModule } from '../logger/logger.module';
import { SectorsModule } from '../sectors/sectors.module';
import { IndustriesModule } from '../industries/industries.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Position]),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
    CompanyProfilesModule,
    LoggerModule,
    SectorsModule,
    IndustriesModule,
  ],
  controllers: [PositionsController],
  providers: [PositionsService],
})
export class PositionsModule {}
