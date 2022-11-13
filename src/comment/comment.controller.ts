import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
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
    async createComment(
        @Body() createCommentDto: CreateCommentDto, @GetUser() user: UserI,
    ) {
        return await this. commentService.createComment(
            createCommentDto,
            user
        );
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    getAllComment(@GetUser() user: UserI) {
      return this.commentService.getAllComment(user);
    }
}
