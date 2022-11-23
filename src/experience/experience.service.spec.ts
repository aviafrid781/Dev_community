import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceService } from './experience.service';
import { Logger, NotFoundException } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Experience, ExperienceSchema } from './schema/experience.schema';
import { AppModule } from '../app.module';
import { CreateExperienceDto } from './dto/create-experience.dto'
const mockUser = {
  "_id": "6371d6952c18a939b245fe58",
  "fname": "john",
  "lname": "doe",
  "email": "J.Doe@gmail.com",
  "address": "dhaka",
  "userType": "developer",
}


const mockExperience= {

  "companyName": "tigerIt BD",
  "totalYear": 6,
  "stackName": "Nest js with mongoDB",
  "userId": "6371d6952c18a939b245fe58",
};


describe('ExperienceService', () => {
  let service: ExperienceService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Experience.name, schema: ExperienceSchema },
        ]),
        AppModule
        ,
      ],
      exports: [ExperienceService]
    }).compile();
    
    service = module.get<ExperienceService>(ExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it('should be defined', async () => {
      const result = await service.create(mockExperience, mockUser)
      console.log(result);
      expect(result).toEqual(expect.any(Object))
    });
  });


  describe("getExperienceById", () => {
    it('should be return experience by id', async () => {
      const result = service.getExperienceById("637db9967b3a609caa3b8c65")
      console.log(result);
      expect(result).toEqual(expect.any(Object));
    });
  });

  const createExperienceDto={

    companyName: 'tigerIt BD',
    totalYear: 6,
    stackName: 'Nest js with mongoDB',
    userId: "6371d6952c18a939b245fe58",
    _id: "637dd133d99da83347620709",
    
  }

  describe("updateById", () => {
    it('should be return experience by id', async () => {
      const result = service.updateById("6375c6d3b25917a352f06a91", createExperienceDto, mockUser)
      console.log(result);
      console.log(createExperienceDto);
      expect(result).toEqual(expect.any(Object))
    });
  });


});
