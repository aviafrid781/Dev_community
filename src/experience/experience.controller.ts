import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { ExperienceService } from './experience.service';
import { ExperienceDocument } from './schema/experience.schema';

@Controller('experience')
export class ExperienceController {
    constructor(private readonly experienceService: ExperienceService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createExperience(
        @Body() createExperienceDto: CreateExperienceDto, @GetUser() user: UserI,
    ) {
        return await this.experienceService.createExperience(
            createExperienceDto,
            user
        );
    }


    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateExperience(@Param('id') id: string, @Body('') experienceDocument: ExperienceDocument, @GetUser() user: UserI) {
        return this.experienceService.updateExperience(id,experienceDocument,user);
    }

}
