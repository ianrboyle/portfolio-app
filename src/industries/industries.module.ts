import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Industry } from './industries.entity';
import { IndustriesService } from './industries.service';

@Module({
  imports: [TypeOrmModule.forFeature([Industry])],
  providers: [IndustriesService],
})
export class IndustriesModule {}
