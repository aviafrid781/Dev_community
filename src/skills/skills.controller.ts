import { Body, Controller, Param, Post, Put, UseGuards } from '@nestjs/common';
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
    update(@Param('id') id: string, @Body('') SkillsDocument: SkillsDocument, @GetUser() user: UserI) {
        return this.skillsService.update(id, SkillsDocument,user);
    }
}
