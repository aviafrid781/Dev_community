import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { ElasticSearchHelper, IndexNames } from './../Helper/elastic.search.helper';
import { CreateUserDto } from './dto/create-user.dto';
import { SearchUsersDto } from './dto/searchUser.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserType } from './model/user.type.enum';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  ElasticsearchService: any;

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private readonly logger: Logger,
  ) { }

  async createUser(createUserDto: CreateUserDto) {

    const existingUser = await this.userModel.findOne({ email: createUserDto.email });
    if (!existingUser) {
      const createdUser = await this.insertUser(createUserDto);

      // if (createdUser) {
      //   const userObj = createdUser.toObject();
      //   ElasticSearchHelper.index(IndexNames.USER, userObj)
      // }

      const { accessToken, refreshToken }: { accessToken: string; refreshToken: string; } = this.generateTokens(createUserDto);
      const userObj = this.removePassword(createdUser);
      const data = this.getUserWithTokens(userObj, accessToken, refreshToken);
      return data
    } else {
      throw new UnauthorizedException({ message: 'your email is already used' });
    }
  }


  private getUserWithTokens(userObj, accessToken: string, refreshToken: string): { createdUser: mongoose.LeanDocument<any> & { _id: mongoose.Types.ObjectId; }; accessToken: string; refreshToken: string; } {
    return {
      createdUser: userObj,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  private removePassword(user: mongoose.Document<unknown, any, UserDocument> & User & Document & { _id: mongoose.Types.ObjectId; }) {
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

  async signIn(email: string, password: string) {
    const user = await this.findOneByEmail(email)
    if (email === user.email && (await bcrypt.compare(password, user.password))) {
      const { accessToken, refreshToken }: { accessToken: string; refreshToken: string; } = this.generateTokens(user);
      const userObj = this.removePassword(user);
      const data = this.getUserWithTokens(userObj, accessToken, refreshToken);
      return data
    }
    else {
      throw new UnauthorizedException({ message: 'user not found' });
    }
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email: email });
  }

  async getUsersFromElasticSearch(query: SearchUsersDto) {
    const pageSize = parseInt(query.pageSize ?? '200');
    const current = parseInt(query.current ?? '1');
    const searchFilters = {
      query: {
        bool: {
          must: [],
          filter: [],
        },
      },
      size: pageSize,
      from: ((current - 1) * pageSize) | 0,
    };

    if (query.search) {
      let queryStr = ElasticSearchHelper.getFixedQueryString(query.search)
      searchFilters.query.bool.must.push({
        query_string: {
          // query: `\"*${query?.search}*\"`,
          query: queryStr,
          fields: ['fname', 'lname'],
        },
      });
    }

    delete query.search;
    delete query.current;
    delete query.search;
    delete query.pageSize;

    let queryString = '';
    const queryKeys = Object.keys(query);
    for (let i = 0; i < queryKeys.length; i++) {
      const splittedParts = (
        '"' +
        query[queryKeys[i]].split(',').join('" , "') +
        '"'
      )
        .split(',')
        .join(' OR ');

      queryString += `${queryKeys[i]}:(${splittedParts})`;

      if (i < queryKeys.length - 1) {
        queryString += ' AND ';
      }
    }

    if (queryString != '') {

      searchFilters.query.bool.must.push({
        query_string: {
          query: queryString,
        },
      });
    }

    const resp = await ElasticSearchHelper.search(
      IndexNames.USER,
      searchFilters,
    );

    const data = resp.body?.hits?.hits;
    const count = resp.body?.hits?.total?.value ?? 0;
    return  {
      data,
      count,
    };
  }

  async updateById(id: string, createUserDto: CreateUserDto) {
    const updatedUser = await this.userModel.findByIdAndUpdate(id, createUserDto);
    if (updatedUser) {
      const userObj = updatedUser.toObject();
      ElasticSearchHelper.index(IndexNames.USER, userObj)
    }
    return await updatedUser
  }

  async remove(id: string) {
    const user = await this.userModel.findByIdAndDelete(id)
    return await ElasticSearchHelper.remove(id, IndexNames.USER);
  }

}
