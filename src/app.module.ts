import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SkillsModule } from './skills/skills.module';
//developer
//XWFf5M5Q0evox2mr
@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://restaurant:6NXhRsDpLSjD2r9y@cluster0.tamfjg8.mongodb.net/?retryWrites=true&w=majority`,
    ),

    UserModule,

    SkillsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
