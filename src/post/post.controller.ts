import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/user/get-user.decorator';
import { UserI } from 'src/user/interfaces/user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { PostService } from './post.service';

@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async createPost(
        @Body() createPostDto: CreatePostDto, @GetUser() user: UserI,
    ) {
        return await this.postService.createPost(
            createPostDto,
            user
        );
    }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getPosts(@GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.postService.getPosts(user, page, count);
    }
}
