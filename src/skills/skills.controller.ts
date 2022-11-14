import { Body, Controller, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { SkillsDocument } from './schema/skills.schema';
import { SkillsService } from './skills.service';

@Controller('skills')
export class SkillsController {
    constructor(private readonly skillsService: SkillsService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createSkillsDto: CreateSkillsDto, @GetUser() user: UserI,
    ) {
        return await this.skillsService.create(
            createSkillsDto,
            user
        );
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    updateById(@Param('id') id: string, @Body('') SkillsDocument: SkillsDocument, @GetUser() user: UserI) {
        return this.skillsService.updateById(id, SkillsDocument,user);
    }
    
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getSkills(@GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.skillsService.getSkills(user, page, count);
    }
}
