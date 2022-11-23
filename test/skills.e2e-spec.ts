import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { SkillsService } from '../src/skills/skills.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Skills, SkillsSchema } from '../src/skills/schema/skills.schema';
import { SkillsController } from 'src/skills/skills.controller';


describe('AppController (e2e)', () => {
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
        await app.init();
    });

    it('/skills (GET)', () => {
        return request(app.getHttpServer())
            .get('/skills')
            .expect(200)
            .expect('');
    });
});
