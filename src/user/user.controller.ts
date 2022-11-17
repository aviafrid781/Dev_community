import {
  Body,
  Controller, Delete, Get, Param, Post, Put, Query,
  Req,
  UseGuards
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUsersDto } from './dto/searchUser.dto';
import { GetUser } from './get-user.decorator';
import { UserI } from './interfaces/user.interface';
import { UserService } from './user.service';
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ) {
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

  @Get('elastic')
  async getUsersFromElasticSearch(@Query() queries: SearchUsersDto): Promise<{ data: any; count: any; }> {
    return await this.userService.getUsersFromElasticSearch(queries);
  }

  @Put('elastic:id')
  async updateById(@Param('id') id: string, @Body('') createUserDto:CreateUserDto ) {
    return await this.userService.updateById(id, createUserDto);
  }

  @Delete('elastic/:id')
  async remove(@Param('id') id: string) {
    return await  this.userService.remove(id);
  }


}
