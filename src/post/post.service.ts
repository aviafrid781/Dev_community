import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { Posts } from './schema/post.schema';
import * as mongoose from 'mongoose';
import { SearchPostDto } from './dto/search-post.dto';
import { ElasticSearchHelper, IndexNames } from 'src/Helper/elastic.search.helper';
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
      
      if (createPost) {
        const userObj = createPost.toObject();
        ElasticSearchHelper.index(IndexNames.post, userObj)
      }

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

  async getUsersFromElasticSearch(query: SearchPostDto) {
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
      IndexNames.post,
      searchFilters,
    );

    const data = resp.body?.hits?.hits;
    const count = resp.body?.hits?.total?.value ?? 0;
    return {
      data,
      count,
    };
  }
  async updateByIdElastic(id: string, createPostDto: CreatePostDto) {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, createPostDto);
    if (updatedPost) {
      const userObj = updatedPost.toObject();
      ElasticSearchHelper.index(IndexNames.post, userObj)
    }
    return await updatedPost
  }

  async remove(id: string) {
    const user = await this.postModel.findByIdAndDelete(id)
    return await ElasticSearchHelper.remove(id, IndexNames.post);
  }



}
