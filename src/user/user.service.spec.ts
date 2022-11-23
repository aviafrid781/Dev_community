import { Logger } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { jwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refreshToken.strategy';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';

const user = {
  "fname": "popi",
  "lname": "khan",
  "password":"ajdkdjs",
  "email": "jackmaaa1@gmail.com12",
  "address": "dhaka",
  "userType": "developer",
  
}
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, jwtStrategy, RefreshTokenStrategy, Logger],
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
          secret: 'topSecret51',
          signOptions: {
            expiresIn: 3600,
          },
        }),
        AppModule,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });


  describe("createUser", () => {
    it('Testing create user', async () => {  
     
      const result = await service.createUser(user);
      console.log(result);
      expect(result).toEqual(expect.any(Object))

    });
  });

});