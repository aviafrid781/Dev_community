import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
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

    async create(createCommentDto: CreateCommentDto
        , user: UserI
    ): Promise<mongoose.Document<unknown, any, Document> & Document & { _id: import("mongoose").Types.ObjectId; }> {
        if (user.userType == 'developer') {
            const comment = this.insertComment(createCommentDto, user);
            const createdComment = await this.commentModel.create(comment);

            return createdComment;
        } else {
            throw new UnauthorizedException({
                massage:
                    'Sorry!! You are not Developer'
            }
            );
        }
    }

    private insertComment(createCommentDto: CreateCommentDto, user: UserI): { comment: string; postId: string; userId: any; } {
        return {
            comment: createCommentDto.comment ? createCommentDto.comment : "",
            postId: createCommentDto.postId ? createCommentDto.postId : "",
            userId: user._id ? user._id : "",
        };
    }

    async getComment(id: string, user: UserI, page: number, count: number): Promise<{ data: any[]; count: any; }> {

        if (user.userType == 'developer') {
            const aggregate = [];

            aggregate.push(
                { $match: { userId: new mongoose.Types.ObjectId(id) } }
            )

            aggregate.push(
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "userId",
                        foreignField: "_id",
                        as: "users"
                    },
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
            throw new UnauthorizedException({
                massage:
                    'you can not see comments!!You are not Developer'
            }
            );


        }
    }

}
