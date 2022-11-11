import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';
import { UserI } from './interfaces/user.interface';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<{ accessToken: string }> {
    return await this.userService.createUser(createUserDto);
  }

  @Post('signIn')
  signIn(
    @Body('email') email: string,
    @Body('password') password: string,
  ): Promise<{ accessToken: string }> {
    return this.userService.signIn(email, password);
  }

  @Post('test')
  @UseGuards(AuthGuard('jwt'))
  test(@Req() req, @GetUser() user: UserI) {
    return { message: 'User is authenticated', user: user };
  }
}
