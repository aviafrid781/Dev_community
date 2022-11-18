import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Skills, SkillsSchema } from './schema/skills.schema';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';

@Module({

  imports: [
    MongooseModule.forFeature([
      { name: Skills.name, schema: SkillsSchema },
    ]),
    SkillsModule
   ,
  ],
  controllers: [SkillsController],
  providers: [SkillsService, Logger],
  exports: [SkillsService,]
})
export class SkillsModule {}
