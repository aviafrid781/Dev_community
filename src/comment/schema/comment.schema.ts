import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { PostI } from 'src/post/interfaces/post.interface';
import { User } from 'src/user/schema/user.schema';
export type CommentDocument = Comment & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Comment {

    @Prop({
        type: String,
    })
    comment: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'PostI' })
    postId: PostI;
        

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
