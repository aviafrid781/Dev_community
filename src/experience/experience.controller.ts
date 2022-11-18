import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/get-user.decorator';
import { UserI } from '../user/interfaces/user.interface';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { ExperienceService } from './experience.service';
import { ExperienceDocument } from './schema/experience.schema';
import { SearchExperienceDto } from './schema/searchExperience.dto';

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

    @Get('elastic')
    async getExperienceFromElasticSearch(@Query() queries: SearchExperienceDto): Promise<{ data: any; count: any; }> {
        return await this.experienceService.getExperienceFromElasticSearch(queries);
    }

    @Put('elastic/:id')
     async updateByIdElastic(@Param('id') id: string, @Body('') createExperienceDto: CreateExperienceDto) {
        return await this.experienceService.updateByIdElastic(id, createExperienceDto);
    }

    @Delete('elastic/:id')
    async   remove(@Param('id') id: string) {
        return await this.experienceService.remove(id);
    }

}
