import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Posts } from 'src/post/schema/post.schema';

import { User } from 'src/user/schema/user.schema';
export type CommentDocument = Comment & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Comment {

    @Prop({
        type: String,
    })
    comment: string;

        
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' })
    postId: Posts;

        
    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
