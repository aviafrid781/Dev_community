import { Document } from 'mongoose';
export interface SkillsI extends Document {
  skillsName: string;
  expertise: string;
  userId: string;
}
