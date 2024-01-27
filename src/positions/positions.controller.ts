import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
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

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(PositionDto)
  createPosition(@Body() body: CreatePositionDto, @CurrentUser() user: User) {
    const position = this.positionsService.create(body, user);
    return position;
  }
  @Get()
  @UseGuards(AuthGuard)
  getUserPositions(@CurrentUser() user: User) {
    const userId = user.id;
    const userPositions = this.positionsService.getUserPositions(userId);
    return userPositions;
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  updateUser(@Param('id') id: string, @Body() body: UpdatePositionDto) {
    return this.positionsService.update(parseInt(id), body);
  }
}
