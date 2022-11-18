import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { Skills, SkillsSchema } from './schema/skills.schema';
import { SkillsService } from './skills.service';

const mockSkills = {

  "skillsName": "java",
  "expertise": "javascript",
  "userId": "6371d6952c18a939b245fe58",
  "userType": "developer"
}
const mockUser = {

    "_id": "6371d6952c18a939b245fe58",
    "fname": "john",
    "lname": "doe",
    "email": "J.Doe@gmail.com",
    "address": "dhaka",
    "userType": "developer",
    "created_at": "2022-11-14T05:48:05.396Z",
    "updated_at": "2022-11-14T05:48:05.396Z",
    "__v": 0
}

describe('SkillsService',  () => {
  let service: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [SkillsService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Skills.name, schema: SkillsSchema },
        ]),
        AppModule
      ],
      exports: [SkillsService,]

    }).compile();

    service = module.get<SkillsService>(SkillsService);
  })
  

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("get createSkills function", () => {
    it('should be defined', async () => {

      const result = await service.createSkills(mockSkills, mockUser)  
      console.log(result);
      expect(result).toEqual(expect.any(Object))

    });
 
  });



});