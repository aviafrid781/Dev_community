import { Injectable, Logger, Post, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import {  Posts } from './schema/post.schema';

@Injectable()
export class PostService {
    constructor(
        @InjectModel(Posts.name)
        private postModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async createPost(createPostDto: CreatePostDto

        , user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const post = {
                title: createPostDto.title ? createPostDto.title : "",
                description: createPostDto.description ? createPostDto.description : "",
                userId: user._id ? user._id : "",

            };
            const createdPost = await this.postModel.create(post);

            return createdPost;
        } else {
            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }
  async getPosts(user: UserI, page: number, count: number) {

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
      throw new UnauthorizedException(
        'you can not see posts!!You are not Developer',
      );
    }
  }
}
