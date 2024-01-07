import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePositionDto } from './dtos/create-position-dto';
import { PositionsService } from './positions.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize-interceptor';
import { PositionDto } from './dtos/position-dto';

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
}
