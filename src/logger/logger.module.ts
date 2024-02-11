import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomLog } from './custom-log.entity';
import { LoggerService } from './logger.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomLog])],
  providers: [LoggerService],
  exports: [LoggerService],
})
export class LoggerModule {}
