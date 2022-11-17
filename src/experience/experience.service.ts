import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { ElasticSearchHelper, IndexNames } from 'src/Helper/elastic.search.helper';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Experience, ExperienceDocument } from './schema/experience.schema';
import { SearchExperienceDto } from './schema/searchExperience.dto';
@Injectable()
export class ExperienceService {
    constructor(
        @InjectModel(Experience.name)
        private experienceModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async create(createPostDto: CreateExperienceDto

        , user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const experience = this.insertExperience(createPostDto, user);

            if (createPostDto.totalYear >= 0 && createPostDto.totalYear <= 10) {
                const createdExperience = await this.experienceModel.create(experience);
                if (createdExperience) {
                    const userObj = createdExperience.toObject();
                    ElasticSearchHelper.index(IndexNames.experience, userObj)
                }
                return createdExperience;
            }
            else {
                throw new UnauthorizedException({ massage: 'please give a experience range between  >= 1 and <= 5' });
            }
        }
        else {
            throw new UnauthorizedException({
                massage:
                    'Sorry!! You are not Developer'
            });
        }
    }

    private insertExperience(createExperienceDto: CreateExperienceDto, user: UserI): { companyName: string; totalYear: string | number; stackName: string; userId: any; } {
        return {
            companyName: createExperienceDto.companyName ? createExperienceDto.companyName : "",
            totalYear: createExperienceDto.totalYear ? createExperienceDto.totalYear : "",
            stackName: createExperienceDto.stackName ? createExperienceDto.stackName : "",
            userId: user._id ? user._id : "",
        };
    }

    async updateById(id: string, experienceDocument: ExperienceDocument, user: UserI) {

        if (user.userType == 'developer') {
            return this.experienceModel.findByIdAndUpdate(id, experienceDocument);
        }
        else {

            throw new UnauthorizedException({
                massage:
                    'Sorry!! You are not Developer & You can not update Experience'
            }
            );
        }
    }

    async getExperienceDeveloper(user: UserI) {
        if (user.userType == 'developer') {
            const experience = await this.experienceModel
                .find()
                .populate('userId');

            return experience;
        } else {
            throw new UnauthorizedException({
                massage:
                    'You are not Developer!!'
            }
            );
        }
    }


    async getExperience(user: UserI, page: number, count: number): Promise<{ data: any[]; count: any; }> {

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
            const total = await this.experienceModel.aggregate(aggregate).exec()
            aggregate.pop()
            aggregate.push({ $skip: (page - 1) * count });
            aggregate.push({ $limit: count * 1 });
            const data = await this.experienceModel.aggregate(aggregate).exec()

            return { data: data, count: total[0] ? total[0].count : 0 }
        }
        else {
            throw new UnauthorizedException({
                massage:
                    'you can not see experience!!You are not Developer'
            }
            );
        }
    }

    async getExperienceFromElasticSearch(query: SearchExperienceDto) {
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
            IndexNames.experience,
            searchFilters,
        );
        const data = resp.body?.hits?.hits;
        const count = resp.body?.hits?.total?.value ?? 0;
        return {
            data,
            count,
        };
    }

    async updateByIdElastic(id: string, createExperienceDto: CreateExperienceDto) {

        const updateExperience = this.experienceModel.findByIdAndUpdate(id, createExperienceDto);
        if (updateExperience) {
            const userObj = (await updateExperience).toObject();

            return await ElasticSearchHelper.index(IndexNames.experience, userObj)
        }
    }

    async remove(id: string) {
        const user = await this.experienceModel.findByIdAndDelete(id)
        return ElasticSearchHelper.remove(id, IndexNames.experience);
    }


}
