import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { HttpExceptionFilter } from '../logger/HttpException.filter';
import { SectorsService } from './sectors.service';

@Controller('sectors')
@UseFilters(HttpExceptionFilter)
export class SectorsController {
  constructor(private sectorsService: SectorsService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUserSectors(@CurrentUser() user: User) {
    const userId = user.id;
    const userSectors = await this.sectorsService.getUserSectors(userId);
    return userSectors;
  }
}
