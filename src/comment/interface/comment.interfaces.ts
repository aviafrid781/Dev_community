import { Document } from 'mongoose';
export interface CommentI extends Document {
    comment: string;
    postId: string;
    userId: string;
}