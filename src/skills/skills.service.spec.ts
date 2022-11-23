import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import console from 'console';
import { AppModule } from '../app.module';
import { CreateSkillsDto } from './dto/create-skills.dto';
import { Skills, SkillsSchema } from './schema/skills.schema';
import { SkillsService } from './skills.service';


const mockTasksService = () => ({
  findByIdAndUpdate: jest.fn(),
});

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

describe('SkillsService', () => {
  let service: SkillsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({

      providers: [Logger, SkillsService],
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

  describe("createSkills", () => {
    it('should be defined', async () => {
      const result = await service.createSkills(mockSkills, mockUser)
      //console.log(result);
      expect(result).toEqual(expect.any(Object))
    });
  });
  const createSkillsDto={
    "skillsName": "java77776666",
    "expertise": "javascript",
    "userId": "63709b50c09fb6a7c940bda0",
  }
 
  describe('updateById', () => {
    it('update skills by id', async () => {
      const results = await service.updateById("63709b50c09fb6a7c940bda0", createSkillsDto , mockUser);
    
      await expect(results).toEqual(expect.any(Object))

    });
  });


});