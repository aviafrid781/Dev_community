import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Document, Model } from 'mongoose';
import { ElasticSearchHelper, IndexNames } from '../Helper/elastic.search.helper';
import { UserI } from '../user/interfaces/user.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';
import { Comment } from './schema/comment.schema';
@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment.name)
        private commentModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async create(createCommentDto: CreateCommentDto
        , user
    ): Promise<mongoose.Document<unknown, any, Document> & Document & { _id: import("mongoose").Types.ObjectId; }> {
        if (user.userType == 'developer') {
            const comment = this.insertComment(createCommentDto, user);

            const createdComment = await this.commentModel.create(comment);
            if (createdComment) {
                const userObj = createdComment.toObject();
                ElasticSearchHelper.index(IndexNames.comment, userObj)
            }


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


    async getUsersFromElasticSearch(query: SearchCommentDto) {
        const pageSize = parseInt(query.pageSize ?? '200');
        const current = parseInt(query.current ?? '1');
        const searchFilters = {
            query: {
                bool: {
                    must: [],
                    filter: [],
                },
            },
            size: pageSize,
            from: ((current - 1) * pageSize) | 0,
        };

        if (query.search) {
            let queryStr = ElasticSearchHelper.getFixedQueryString(query.search)
            searchFilters.query.bool.must.push({
                query_string: {
                    // query: `\"*${query?.search}*\"`,
                    query: queryStr,
                    fields: ['fname', 'lname'],
                },
            });
        }

        delete query.search;
        delete query.current;
        delete query.search;
        delete query.pageSize;

        let queryString = '';
        const queryKeys = Object.keys(query);
        for (let i = 0; i < queryKeys.length; i++) {
            const splittedParts = (
                '"' +
                query[queryKeys[i]].split(',').join('" , "') +
                '"'
            )
                .split(',')
                .join(' OR ');

            queryString += `${queryKeys[i]}:(${splittedParts})`;

            if (i < queryKeys.length - 1) {
                queryString += ' AND ';
            }
        }
        if (queryString != '') {

            searchFilters.query.bool.must.push({
                query_string: {
                    query: queryString,
                },
            });
        }
        const resp = await ElasticSearchHelper.search(
            IndexNames.comment,
            searchFilters,
        );

        const data = resp.body?.hits?.hits;
        const count = resp.body?.hits?.total?.value ?? 0;
        return {
            data,
            count,
        };
    }
    async updateByIdElastic(id: string, createCommentDto: CreateCommentDto) {
        const updatedComment = await this.commentModel.findByIdAndUpdate(id, createCommentDto);
        if (updatedComment) {
            const userObj = updatedComment.toObject();
            ElasticSearchHelper.index(IndexNames.comment, userObj)
        }
        return await updatedComment
    }

    async remove(id: string) {
        const user = await this.commentModel.findByIdAndDelete(id)
        return await ElasticSearchHelper.remove(id, IndexNames.comment);
    }



}
