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


    async getComment(user: UserI, page: number, count: number) {

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

            aggregate.push(
                {
                    $lookup:
                    {
                        from: "posts",
                        localField: "postId",
                        foreignField: "_id",
                        as: "posts"

                    }
                }
            )
            aggregate.push(
                {
                    $unwind: {
                        path: '$posts',
                        preserveNullAndEmptyArrays: true
                    }
                }
            )
            aggregate.push({ $count: 'count' });
            const total = await this.commentModel.aggregate(aggregate).exec()
            aggregate.pop()
            aggregate.push({ $skip: (page - 1) * count });
            aggregate.push({ $limit: count * 1 });
            const data = await this.commentModel.aggregate(aggregate).exec()

            return { data: data, count: total[0] ? total[0].count : 0 }
        }
        else {
            throw new UnauthorizedException(
                'you can not see comments!!You are not Developer',
            );
        }
    }

}
