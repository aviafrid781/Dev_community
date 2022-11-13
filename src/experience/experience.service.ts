import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Experience, ExperienceDocument } from './schema/experience.schema';

@Injectable()
export class ExperienceService {
    constructor(
        @InjectModel(Experience.name)
        private experienceModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async createExperience(createPostDto: CreateExperienceDto

        , user: UserI
    ) {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const experience = {
                companyName: createPostDto.companyName ? createPostDto.companyName : "",
                totalYear: createPostDto.totalYear ? createPostDto.totalYear : "",
                stackName: createPostDto.stackName ? createPostDto.stackName : "",
                userId: user._id ? user._id : "",

            };
            const createdExperience = await this.experienceModel.create(experience);

            return createdExperience;
        } else {
            throw new UnauthorizedException(
                'Sorry!! You are not Developer',
            );
        }
    }

    async updateExperience(id: string, experienceDocument: ExperienceDocument,user:UserI) {

        if (user.userType == 'developer') {
        return this.experienceModel.findByIdAndUpdate(id, experienceDocument);
        }
        else{

            throw new UnauthorizedException(
                'Sorry!! You are not Developer & You can not update Experience',
            );
        }
    }

    async  getAllExperienceDeveloper(user: UserI) {
        if (user.userType == 'developer') {
          const experience = await this.experienceModel
            .find()
            .populate('userId');
    
          return experience;
        } else {
          throw new UnauthorizedException(
            'You are not Developer!!',
          );
        }
      }
}
