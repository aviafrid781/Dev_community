import { Document } from 'mongoose';
export interface SkillsI extends Document {
  skillsName: string;
  experience: number;
  userId: string;
}
