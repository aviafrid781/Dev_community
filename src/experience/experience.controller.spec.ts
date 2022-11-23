import { Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { ExperienceController } from './experience.controller';
import {  ExperienceService } from './experience.service'
import { Experience, ExperienceSchema } from './schema/experience.schema';
import { CreateExperienceDto } from './dto/create-experience.dto'


const mockUser = {
  "_id": "6371d6952c18a939b245fe58",
  "fname": "john",
  "lname": "doe",
  "email": "J.Doe@gmail.com",
  "address": "dhaka",
   "userType": "developer",
}
describe('ExperienceController', () => {
  let controller: ExperienceController;
  let service: ExperienceService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      
      providers: [ExperienceService, Logger],
      imports: [
        MongooseModule.forFeature([
          { name: Experience.name, schema: ExperienceSchema },
        ]),
        AppModule
        ,],
      controllers: [ExperienceController],

    }).compile();
    controller = module.get<ExperienceController>(ExperienceController);
    service = module.get<ExperienceService>(ExperienceService);

    (ExperienceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const createExperienceDto=
  {
    "companyName": "tigerIt BD",
    "totalYear": 6,
    "stackName": "Nest js with mongoDB",
    "userId": "6371d6952c18a939b245fe58",
  }

  describe("create", () => {
    it('Create Experience', async () => {
      const result = await service.create(createExperienceDto, mockUser)
      console.log(result);
      expect(result).toEqual(expect.any(Object))
    });
  });


});
