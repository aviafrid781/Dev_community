import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../user/get-user.decorator';
import { UserI } from '../user/interfaces/user.interface';
import { CreatePostDto } from './dto/create-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import { PostService } from './post.service';
@Controller('posts')
export class PostController {

    constructor(private readonly postService: PostService) { }

    @Post()
    @UseGuards(AuthGuard('jwt'))
    async create(
        @Body() createPostDto: CreatePostDto, @GetUser() user: UserI,
    ) {
        return await this.postService.create(
            createPostDto,
            user
        );
    }
    @Get()
    @UseGuards(AuthGuard('jwt'))
    getPosts(@GetUser() user: UserI, @Query('page') page: number, @Query('count') count: number) {
        return this.postService.getPosts(user, page, count);
    }

    @Get('elastic')
    async getUsersFromElasticSearch(@Query() queries: SearchPostDto): Promise<{ data: any; count: any; }> {
        return await this.postService.getUsersFromElasticSearch(queries);
    }

    @Put('elastic/:id')
    async updateByIdElastic(@Param('id') id: string, @Body('') createPostDto: CreatePostDto) {
        return await this.postService.updateByIdElastic(id, createPostDto);
    }

    @Delete('elastic/:id')
    async remove(@Param('id') id: string) {
        return await this.postService.remove(id);
    }

    
}
