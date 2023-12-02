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
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user-dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user-dto';
import { UserDto } from './dtos/user-dto';
import { Serialize } from 'src/interceptors/serialize-interceptor';
import { AuthService } from './auth.service';
@Controller('auth')
@Serialize(UserDto)
//consider exception filter
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}
  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    this.authService.signup(body.email, body.password);
  }

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
