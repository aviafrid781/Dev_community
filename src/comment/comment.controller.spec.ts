import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './schema/comment.schema';

const comment = {

  "comment": "bad",
  "postId": "63709e719d886ccdb55149b5",
  "userId": "6371d6952c18a939b245fe58",
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

describe('CommentController', () => {
  let controller: CommentController;
  let service:CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [CommentService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
        ]),
        AppModule
        ,
      ],
    }).compile();

     controller = module.get<CommentController>(CommentController);
     service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it('create comments', async () => {
      const result = await service.create(comment, User);
      console.log(result);
      expect(result).toEqual(expect.any(Object))
    });
  });
  

});
