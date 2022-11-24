import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SkillsService } from '../src/skills/skills.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Skills, SkillsSchema } from '../src/skills/schema/skills.schema';
import { SkillsController } from './../src/skills/skills.controller';
import { SkillsModule } from 'src/skills/skills.module';


describe('SkillsController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            controllers: [SkillsController],
            providers: [Logger, SkillsService],
            imports: [
                MongooseModule.forFeature([
                    { name: Skills.name, schema: SkillsSchema },
                ]),
                AppModule

            ],
            exports: [SkillsService,]
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api');
        await app.init();
    });

    it('should create new user', () => {
        return request(app.getHttpServer())
            .post('/skills/skills')
            .send({
                "skillsName": "java bbbb",
                "expertise": "fdgfg",
                "userId": "6371d6952c18a939b245fe58",
            })
            .expect(404)
            
    });
});
