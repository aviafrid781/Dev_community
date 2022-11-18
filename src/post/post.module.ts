import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { Posts, PostSchema } from './schema/post.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Posts.name, schema: PostSchema },
    ]),
    PostModule
    ,
  ],
    
  controllers: [PostController],
  providers: [PostService, Logger],
  exports: [PostService]
})
export class PostModule {}
