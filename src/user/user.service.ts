import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserType } from './model/user.type.enum';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) { }

  async createUser(createUserDto: CreateUserDto): Promise<{ createdUser: mongoose.LeanDocument<UserDocument> & { _id: mongoose.Types.ObjectId; }; accessToken: string; refreshToken: string; }> {
    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (!existingUser) {
      const createdUser = await this.insertUser(createUserDto);
      const { accessToken, refreshToken }: { accessToken: string; refreshToken: string; } = this.generateTokens(createUserDto);
      const userObj = this.removePassword(createdUser);
      const data = this.getUserWithTokens(userObj, accessToken, refreshToken);
      return data
    } else {
      throw new UnauthorizedException({ message: 'your email is already used' });
    }
  }


  private getUserWithTokens(userObj: mongoose.LeanDocument<UserDocument> & { _id: mongoose.Types.ObjectId; }, accessToken: string, refreshToken: string) {
    return {
      createdUser: userObj,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private removePassword(user: mongoose.Document<unknown, any, UserDocument> & User & Document & { _id: mongoose.Types.ObjectId; }): mongoose.LeanDocument<UserDocument> & { _id: mongoose.Types.ObjectId; } {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }

  private generateTokens(createUserDto: CreateUserDto): { accessToken: string; refreshToken: string; } {
    const payload: JwtPayload = { email: createUserDto.email };
    const accessToken: string = this.jwtService.sign(payload);
    const refreshToken: string = this.jwtService.sign(payload);
    return { accessToken, refreshToken };
  }

  private async insertUser(createUserDto: CreateUserDto): Promise<mongoose.Document<unknown, any, UserDocument> & User & Document & { _id: mongoose.Types.ObjectId; }> {
    const hashPassword = await this.generateHash(createUserDto);
    const user = this.constructUser(createUserDto, hashPassword);
    const createdUser = await this.userModel.create(user);
    return createdUser;
  }

  private constructUser(createUserDto: CreateUserDto, hashPassword: string): { fname: string; lname: string; email: string; password: string; address: string; userType: string; } {
    return {
      fname: createUserDto.fname ? createUserDto.fname : '',
      lname: createUserDto.lname ? createUserDto.lname : '',
      email: createUserDto.email ? createUserDto.email : '',
      password: hashPassword,
      address: createUserDto.address ? createUserDto.address : '',
      userType: createUserDto.userType ? createUserDto.userType : UserType.Developer,
    };
  }

  private async generateHash(createUserDto: CreateUserDto): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashPassword = await bcrypt.hash(createUserDto.password, salt);
    return hashPassword;
  }

  async signIn(email: string, password: string): Promise<{ createdUser: mongoose.LeanDocument<UserDocument> & { _id: mongoose.Types.ObjectId; }; accessToken: string; refreshToken: string; }> {
    const user = await this.findOneByEmail(email)
    if (email === user.email && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken }: { accessToken: string; refreshToken: string; } = this.generateTokens(user);
      const userObj = this.removePassword(user);
      const data = this.getUserWithTokens(userObj, accessToken, refreshToken);
      return data
    }
    else {
      throw new UnauthorizedException({message: 'user not found'});
    }
  }

  async findOneByEmail(email: string): Promise<mongoose.Document<unknown, any, UserDocument> & User & Document & { _id: mongoose.Types.ObjectId; }> {
    return await this.userModel.findOne({ email: email });
  }
}
