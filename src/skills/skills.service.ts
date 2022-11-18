import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserI } from '../user/interfaces/user.interface';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { Skills, SkillsDocument } from './schema/skills.schema';
import * as mongoose from 'mongoose';
import { ElasticSearchHelper, IndexNames } from '../Helper/elastic.search.helper';
import { SearchSkillsDto } from './dto/SearchSkills.dto';
@Injectable()
export class SkillsService {
    constructor(
        @InjectModel(Skills.name)
        private skillsModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async createSkills(createSkillsDto: CreateSkillsDto, user): Promise<Document<any, any, any> & { _id: mongoose.Types.ObjectId; }>
    {
        if (user.userType == 'developer') {
            const userSkills = this.insertSkills(createSkillsDto, user);
            const Skills = await this.skillsModel.create(userSkills);
            // if (Skills) {
            //     const userObj = Skills.toObject();
            //     ElasticSearchHelper.index(IndexNames.skills, userObj)
            // }

            return Skills;
        } else {
            throw new UnauthorizedException({
                massage:
                'Sorry!! You are not Developer'}
            );
        }
    }
    private insertSkills(createSkillsDto: CreateSkillsDto, user: UserI): { skillsName: string; expertise: string; userId: any; } {
        return {
            skillsName: createSkillsDto.skillsName ? createSkillsDto.skillsName : "",
            expertise: createSkillsDto.expertise ? createSkillsDto.expertise : "",
            userId: user._id ? user._id : "",
        };
    }

    async updateById(id: string, skillsDocument: SkillsDocument, user: UserI) {

        if (user.userType == 'developer') {
            return this.skillsModel.findByIdAndUpdate(id, skillsDocument);
        }
        else {

            throw new UnauthorizedException({
                massage:
                'Sorry!! You are not Developer'}
            );
        }
    }
    
    async getSkills(user: UserI, page: number, count: number): Promise<{ data: any[]; count: any; }> {

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
            const total = await this.skillsModel.aggregate(aggregate).exec()
            aggregate.pop()
            aggregate.push({ $skip: (page - 1) * count });
            aggregate.push({ $limit: count * 1 });
            const data = await this.skillsModel.aggregate(aggregate).exec()

            return { data: data, count: total[0] ? total[0].count : 0 }
        }
        else {
            throw new UnauthorizedException({
                massage:
                'you can not see skills!!You are not Developer'}
            );
        }
    }


    async getUsersFromElasticSearch(query: SearchSkillsDto) {
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
            IndexNames.skills,
            searchFilters,
        );

        const data = resp.body?.hits?.hits;
        const count = resp.body?.hits?.total?.value ?? 0;
        return {
            data,
            count,
        };
    }

    async updateByIdElastic(id: string, createSkillsDto: CreateSkillsDto) {
        const updatedSkills = await this.skillsModel.findByIdAndUpdate(id, createSkillsDto);
        if (updatedSkills) {
            const userObj = updatedSkills.toObject();
            ElasticSearchHelper.index(IndexNames.skills, userObj)
        }
        return await updatedSkills
    }

    async remove(id: string) {
        const user = await this.skillsModel.findByIdAndDelete(id)
        return await  ElasticSearchHelper.remove(id, IndexNames.skills);
    }



}
