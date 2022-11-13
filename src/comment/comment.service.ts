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
        private commentModel: Model<Document>,
        private readonly logger: Logger,
    ) { }
   
    async createComment(createCommentDto: CreateCommentDto

        , user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const comment = {
                comment: createCommentDto.comment ? createCommentDto.comment : "",
                postId: createCommentDto.postId ? createCommentDto.postId : "",
                userId: user._id ? user._id : "",

            };
            const createdComment = await this.commentModel.create(comment);

            return createdComment;
        } else {
            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }
}
