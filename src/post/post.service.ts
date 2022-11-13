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
    async  getAllPost(user: UserI) {
        if (user.userType == 'developer') {
          const posts = await this.postModel
            .find()
            .populate('userId');
    
          return posts;
        } else {
          throw new UnauthorizedException(
            'You are not Developer!!',
          );
        }
      }
}
