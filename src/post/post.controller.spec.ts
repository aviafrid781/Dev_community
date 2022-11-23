import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Posts, PostSchema } from './schema/post.schema';



const post = {
  "title": "react problem",
  "description": "i cant setup react.please help",
  "userId": "63709b50c09fb6a7c940bda0",
}
const User = {

  "_id": "6371d6952c18a939b245fe58",
  "fname": "john",
  "lname": "doe",
  "email": "J.Doe@gmail.com",
  "address": "dhaka",
  "userType": "developer",
  "created_at": "2022-11-14T05:48:05.396Z",
  "updated_at": "2022-11-14T05:48:05.396Z",
  "__v": 0
}
describe('PostController', () => {
  let controller: PostController;
  let service: PostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],

      providers: [PostService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Posts.name, schema: PostSchema },
        ]),
        AppModule
      ],
      exports: [PostService],
    }).compile();
    controller = module.get<PostController>(PostController);
    service = module.get<PostService>(PostService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it('should be defined', async () => {
      const result = await service.create(post, User)
      console.log(result);
      expect(result).toEqual(expect.any(Object))
    });

  });

});
