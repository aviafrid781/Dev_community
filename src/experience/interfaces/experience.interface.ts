import { Document } from 'mongoose';
export interface PostI extends Document {
    companyName: string;
    totalYear: Number;
    stackName: string;
    userId: string;
}