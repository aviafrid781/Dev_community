import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/get-user.decorator';
import { UserI } from '../user/interfaces/user.interface';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { SearchSkillsDto } from './dto/SearchSkills.dto';
import { SkillsDocument } from './schema/skills.schema';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createSkills(
        @Body() createSkillsDto: CreateSkillsDto, @GetUser() user: UserI,
    ) {
        return await this.skillsService.createSkills(
            createSkillsDto,
            user
        );
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateById(@Param('id') id: string, @Body('') createSkillsDto: CreateSkillsDto, @GetUser() user: UserI) {
        return this.skillsService.updateById(id, createSkillsDto,user);
    }
    
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getSkills(@GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.skillsService.getSkills(user, page, count);
    }

    @Get('elastic')
    async getUsersFromElasticSearch(@Query() queries: SearchSkillsDto): Promise<{ data: any; count: any; }> {
        return await this.skillsService.getUsersFromElasticSearch(queries);
    }

    @Put('elastic/:id')
    async updateByIdElastic(@Param('id') id: string, @Body('') createSkillsDto: CreateSkillsDto) {
        return await this.skillsService.updateByIdElastic(id, createSkillsDto);
    }

    @Delete('elastic/:id')
    async remove(@Param('id') id: string) {
        return await this.skillsService.remove(id);
    }

}
