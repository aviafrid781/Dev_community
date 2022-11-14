import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
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
        return await this.experienceService.create(
            createExperienceDto,
            user
        );
    }


    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateById(@Param('id') id: string, @Body('') experienceDocument: ExperienceDocument, @GetUser() user: UserI) {
        return this.experienceService.updateById(id, experienceDocument, user);
    }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getExperience(@GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.experienceService.getExperience(user, page, count);
    }

}
