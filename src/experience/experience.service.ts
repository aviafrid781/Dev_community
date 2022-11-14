import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { Experience, ExperienceDocument } from './schema/experience.schema';
import * as mongoose from 'mongoose';
@Injectable()
export class ExperienceService {
    constructor(
        @InjectModel(Experience.name)
        private experienceModel: Model<Document>,
        private readonly logger: Logger,
    ) { }

    async create(createPostDto: CreateExperienceDto

        , user: UserI
    ): Promise<mongoose.Document<unknown, any, Document> & Document & { _id: mongoose.Types.ObjectId; }> {
        this.logger.log(user);
        if (user.userType == 'developer') {
            const experience = this.insertExperience(createPostDto, user);
            if (createPostDto.totalYear >= 0 && createPostDto.totalYear <= 10) {
                const createdExperience = await this.experienceModel.create(experience);

                return createdExperience;
            }
            else {
                throw new UnauthorizedException({ massage: 'please give a review range between  >= 1 and <= 5' });
            }
        }
        else {
            throw new UnauthorizedException({
                massage:
                    'Sorry!! You are not Developer'
            });
        }
    }

    private insertExperience(createPostDto: CreateExperienceDto, user: UserI): { companyName: string; totalYear: string | number; stackName: string; userId: any; } {
        return {
            companyName: createPostDto.companyName ? createPostDto.companyName : "",
            totalYear: createPostDto.totalYear ? createPostDto.totalYear : "",
            stackName: createPostDto.stackName ? createPostDto.stackName : "",
            userId: user._id ? user._id : "",
        };
    }

    async updateById(id: string, experienceDocument: ExperienceDocument, user: UserI): Promise<mongoose.Document<unknown, any, Document> & Document & { _id: mongoose.Types.ObjectId; }> {

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

    async getExperienceDeveloper(user: UserI): Promise<Omit<mongoose.Document<unknown, any, Document> & Document & { _id: import("mongoose").Types.ObjectId; }, never>[]> {
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






}
