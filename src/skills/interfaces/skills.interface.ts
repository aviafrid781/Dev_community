import { Document } from 'mongoose';
export interface SkillsI extends Document {
  skillsName: string;
  expertises: string;
  userId: string;
}
