import { Body, Injectable, Logger, Param, Put, UnauthorizedException } from '@nestjs/common';
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

    async createSkills(createSkillsDto: CreateSkillsDto
        
        ,user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const skills = {
                skillsName: createSkillsDto.skillsName ? createSkillsDto.skillsName : "",
                experience: createSkillsDto.experience ? createSkillsDto.experience : "",
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
    async update(id: string, SkillsDocument: SkillsDocument,user:UserI) {

        if (user.userType == 'developer') {
        return this.skillsModel.findByIdAndUpdate(id, SkillsDocument);
        }
        else{

            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }



}
