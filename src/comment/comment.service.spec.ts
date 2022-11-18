import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
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



describe('CommentService', () => {
  let service: CommentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
        ]),
        AppModule
        ,
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("get createSkills function", () => {
    it('should be defined', async () => {

    const result = await service.create(comment, User);
      console.log(result);
      expect(result).toEqual(expect.any(Object))

    });

  });
 
});
