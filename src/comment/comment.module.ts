import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './schema/comment.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
    ]),
    CommentModule
    ,
  ],
  controllers: [CommentController],
  providers: [CommentService, Logger],
  exports: [CommentService]
})
export class CommentModule {}
