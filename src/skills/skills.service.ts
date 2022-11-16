import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { Skills, SkillsDocument } from './schema/skills.schema';
import * as mongoose from 'mongoose';
@Injectable()
export class SkillsService {
    constructor(
        @InjectModel(Skills.name)
        private skillsModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async create(createSkillsDto: CreateSkillsDto, user: UserI)
    {
        if (user.userType == 'developer') {
            const userSkills = this.insertSkills(createSkillsDto, user);
            const Skills = await this.skillsModel.create(userSkills);

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



}
