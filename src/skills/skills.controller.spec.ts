import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Skills, SkillsSchema } from './schema/skills.schema';
import { SkillsController } from './skills.controller';
import { SkillsService } from './skills.service';
const mockUser = {
  "_id": "6371d6952c18a939b245fe58",
  "fname": "john",
  "lname": "doe",
  "email": "J.Doe@gmail.com",
  "address": "dhaka",
  "userType": "developer",
}
const mockSkills = {
  "skillsName": "java",
  "expertise": "javascript",
  "userId": "63709b50c09fb6a7c940bda0",
}


describe('SkillsController', () => {
  let controller: SkillsController;
  let service: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

  controller = module.get<SkillsController>(SkillsController);
  service = module.get<SkillsService>(SkillsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });




  describe("createSkills", () => {
    it('should be defined', async () => {
      const result = await service.createSkills(mockSkills, mockUser)
      console.log(result);
      expect(result).toEqual(expect.any(Object))
    });
  });
});
