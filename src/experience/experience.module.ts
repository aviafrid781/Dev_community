import { Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExperienceController } from './experience.controller';
import { ExperienceService } from './experience.service';
import { Experience, ExperienceSchema } from './schema/experience.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Experience.name, schema: ExperienceSchema },
    ]),
    ExperienceModule
    ,
  ],
  controllers: [ExperienceController],
  providers: [ExperienceService, Logger]
})
export class ExperienceModule {}
