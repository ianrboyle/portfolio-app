import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CreatePositionDto } from './dtos/create-position-dto';
import { PositionsService } from './positions.service';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { Serialize } from '../interceptors/serialize-interceptor';
import { PositionDto } from './dtos/position-dto';
import { UpdatePositionDto } from './dtos/update-position-dto';
import { HttpExceptionFilter } from '../logger/HttpException.filter';

@Controller('positions')
@Serialize(PositionDto)
@UseFilters(HttpExceptionFilter)
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  createPosition(@Body() body: CreatePositionDto, @CurrentUser() user: User) {
    const position = this.positionsService.create(body, user);
    return position;
  }

  @Post('/insertmultiple')
  @UseGuards(AuthGuard)
  createPositions(
    @Body() body: CreatePositionDto[],
    @CurrentUser() user: User,
  ) {
    const positions = this.positionsService.insertMultiple(body, user);
    return positions;
  }

  @Get()
  @UseGuards(AuthGuard)
  async getUserPositions(@CurrentUser() user: User) {
    const userId = user.id;
    const userPositions = await this.positionsService.getUserPositions(userId);
    return userPositions;
  }
  @Get('/:id')
  @UseGuards(AuthGuard)
  async getPositionById(@Param('id') id: string) {
    return await this.positionsService.findOne(parseInt(id));
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdatePositionDto) {
    return this.positionsService.update(parseInt(id), body);
  }
}
