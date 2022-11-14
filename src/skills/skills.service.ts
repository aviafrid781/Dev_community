import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { Skills, SkillsDocument } from './schema/skills.schema';

@Injectable()
export class SkillsService {
    constructor(
        @InjectModel(Skills.name)
        private skillsModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async createSkills(createSkillsDto:CreateSkillsDto
        
        ,user: UserI
    ) {
        this.logger.log(user);
    
        if (user.userType == 'developer') {
            const skills = {
                skillsName: createSkillsDto.skillsName ? createSkillsDto.skillsName : "",
                expertises:createSkillsDto.expertises ? createSkillsDto.expertises : "",
                userId: user._id ? user._id : "",
              
            };
            const createdSkills = await this.skillsModel.create(skills);

            return createdSkills;
        } else {
            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }
    async updateSkills(id: string, skillsDocument: SkillsDocument,user:UserI) {

        if (user.userType == 'developer') {
        return this.skillsModel.findByIdAndUpdate(id, skillsDocument);
        }
        else{

            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }
    async getSkills(user: UserI, page: number, count: number) {

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
            throw new UnauthorizedException(
                'you can not see skills!!You are not Developer',
            );
        }
    }



}
