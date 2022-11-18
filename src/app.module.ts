import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { ExperienceModule } from './experience/experience.module';
import { ElasticsearchModule } from '@nestjs/elasticsearch/dist/elasticsearch.module';
@Module({
  imports: [
    
    MongooseModule.forRoot(
      `mongodb+srv://restaurant:6NXhRsDpLSjD2r9y@cluster0.tamfjg8.mongodb.net/?retryWrites=true&w=majority`,
    ),
    
    UserModule,

    SkillsModule,

    PostModule,

    CommentModule,

    ExperienceModule,
 
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
