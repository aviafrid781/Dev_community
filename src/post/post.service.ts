import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schema/post.schema';
import * as mongoose from 'mongoose';
@Injectable()
export class PostService {
  constructor(
    @InjectModel(Posts.name)
    private postModel: Model<Document>,
    private readonly logger: Logger,
  ) { }

  async create(createPostDto: CreatePostDto

    , user: UserI
  ): Promise<mongoose.Document<unknown, any, Document> & Document & { _id: import("mongoose").Types.ObjectId; }> {
    this.logger.log(user);
    if (user.userType == 'developer') {
      const post = this.insertPost(createPostDto, user);
      const createPost = await this.postModel.create(post);

      return createPost;
    } else {
      throw new UnauthorizedException({
        massage:
          'Sorry!! You are not Developer'
      }
      );
    }
  }


  private insertPost(createPostDto: CreatePostDto, user: UserI): { title: string; description: string; userId: any; } {
    return {
      title: createPostDto.title ? createPostDto.title : "",
      description: createPostDto.description ? createPostDto.description : "",
      userId: user._id ? user._id : "",
    };
  }

  async getPosts(user: UserI, page: number, count: number): Promise<{ data: any[]; count: any; }> {

    if (user.userType == 'developer') {
      const aggregate = [];

      aggregate.push(
        {
          $lookup:
          {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "users"

          }
        }
      )
      aggregate.push(
        {
          $unwind: {
            path: '$users',
            preserveNullAndEmptyArrays: true
          }
        }
      )

      aggregate.push({ $count: 'count' });
      const total = await this.postModel.aggregate(aggregate).exec()
      aggregate.pop()
      aggregate.push({ $skip: (page - 1) * count });
      aggregate.push({ $limit: count * 1 });
      const data = await this.postModel.aggregate(aggregate).exec()

      return { data: data, count: total[0] ? total[0].count : 0 }
    }
    else {
      throw new UnauthorizedException({
        massage:
          'you can not see posts!!You are not Developer'
      }
      );
    }
  }
}
