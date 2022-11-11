import { Document } from 'mongoose';
export interface PostI extends Document {
    title: string;
    description: string;
    userId: string;
}