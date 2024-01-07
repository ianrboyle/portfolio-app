import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CreatePositionDto } from './dtos/create-position-dto';
import { PositionsService } from './positions.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';

@Controller('positions')
export class PositionsController {
  constructor(private positionsService: PositionsService) {}

  @UseGuards(AuthGuard)
  @Post()
  createPosition(@Body() body: CreatePositionDto, @CurrentUser() user: User) {
    const position = this.positionsService.create(body, user);
    return position;
  }
}
