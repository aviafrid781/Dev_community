import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Comment } from './schema/comment.schema';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private postModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async createPost(createCommentDto: CreateCommentDto

        , user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const post = {
                comment: createCommentDto.comment ? createCommentDto.comment : "",
                
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
}
