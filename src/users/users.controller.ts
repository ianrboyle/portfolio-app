import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { SerializeInterceptor } from 'src/interceptors/serialize-interceptor';
@Controller('auth')
//consider exception filter
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.usersService.create(body, body.email, body.password);
  }

  @UseInterceptors(SerializeInterceptor)
  @Get('/:id')
  async findUserById(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('user not found');
    }
    return user;
  }
  @Get()
  findUserByEmail(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }
  @Delete('/:id')
  removeUserById(@Param('id') id: string) {
    this.usersService.remove(parseInt(id));
  }
}
