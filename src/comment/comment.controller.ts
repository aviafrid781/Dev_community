import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { UserI } from 'src/user/interfaces/user.interface';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { SearchCommentDto } from './dto/search-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService: CommentService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createCommentDto: CreateCommentDto, @GetUser() user: UserI,
    ) {
        return await this.commentService.create(
            createCommentDto,
            user
        );
    }



    @Get()
    @UseGuards(AuthGuard('jwt'))
    getComment(@Query('id') id: string, @GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.commentService.getComment(id, user, page, count);
    }

    @Get('elastic')
    async getUsersFromElasticSearch(@Query() queries: SearchCommentDto): Promise<{ data: any; count: any; }> {
        return await this.commentService.getUsersFromElasticSearch(queries);
    }

    @Put('elastic/:id')
    async updateByIdElastic(@Param('id') id: string, @Body('') createCommentDto: CreateCommentDto) {
        return await this.commentService.updateByIdElastic(id, createCommentDto);
    }

    @Delete('elastic/:id')
    async remove(@Param('id') id: string) {
        return await this.commentService.remove(id);
    }
}
