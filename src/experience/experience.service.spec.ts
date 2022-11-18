import { Test, TestingModule } from '@nestjs/testing';
import { ExperienceService } from './experience.service';
import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Experience, ExperienceSchema } from './schema/experience.schema';
import { AppModule } from '../app.module';

const mockExperienceService={
  "companyName": "tigerIt BD",
  "totalYear": 6,
  "stackName": "Nest js with mongoDB",
  "userId": "6371d6952c18a939b245fe58",

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



describe('ExperienceService', () => {
  let service: ExperienceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExperienceService,Logger],
      imports: [
        MongooseModule.forFeature([
         { name: Experience.name, schema: ExperienceSchema },
        ]),
        AppModule
      ],

      exports: [ExperienceService]
    }).compile();

    service = module.get<ExperienceService>(ExperienceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  describe("get createExperience function", () => {
    it('should be defined', async () => {
      const result = await service.create(mockExperienceService,mockUser)
      console.log(result);
      expect(result).toEqual(expect.any(Object))

    });

  });

});
