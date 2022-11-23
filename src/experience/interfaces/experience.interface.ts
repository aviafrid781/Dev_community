import { Document } from 'mongoose';
export interface ExperienceI extends Document {
    companyName: string;
    totalYear: Number;
    stackName: string;
    userId: string;
}