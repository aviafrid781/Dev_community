import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { UserI } from 'src/user/interfaces/user.interface';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('comment')
export class CommentController {
    constructor(private readonly commentService:CommentService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createCommentDto: CreateCommentDto, @GetUser() user: UserI,
    ) {
        return await this. commentService.create(
            createCommentDto,
            user
        );
    }



    @Get()
    @UseGuards(AuthGuard('jwt'))
    getComment(@Query('id') id: string, @GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.commentService.getComment(id,user, page, count);
    }
}
