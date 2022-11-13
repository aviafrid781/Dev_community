import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { JwtPayload } from './jwt-payload.interface';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    const exitUser = await this.userModel.findOne({email: createUserDto.email});
    this.logger.log(exitUser);
    if (!exitUser) {
      const user = {
        fname: createUserDto.fname ? createUserDto.fname : '',
        lname: createUserDto.lname ? createUserDto.lname : '',
        email: createUserDto.email ? createUserDto.email : '',
        password: hashPassword,
        address: createUserDto.address ? createUserDto.address : '',
        userType: createUserDto.userType ? createUserDto.userType : '',
      };

      const createdUser = await this.userModel.create(user);
      const payload: JwtPayload = { email: createUserDto.email };
      const accessToken: string = await this.jwtService.sign(payload);
      const userObj = createdUser.toObject();
      delete userObj.password;
      return { createdUser: userObj, accessToken: accessToken };
    } else {
      throw new UnauthorizedException('your email is already used');
    }
  }


  async signIn(email: string, password: string) {

    const user = await this.userModel.findOne({ email });

    if (email === user.email && (await bcrypt.compare(password, user.password)))
   {
      const payload: JwtPayload = { email };
      const accessToken: string = await this.jwtService.sign(payload);

      const userObj = user.toObject();
      delete userObj.password;

      return { user: userObj, accessToken: accessToken };
    } 
    
  else {
      throw new UnauthorizedException('user not found');
    }
  }

  async findOne(email: string) {
    return await this.userModel.findOne({ email: email });
  }
}
