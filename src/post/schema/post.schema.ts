import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
export type PostDocument = Posts & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Posts {

    @Prop({
        type: String,
    })
    title: string;

    @Prop({
        type: Number,
    })
    description: number;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const PostSchema = SchemaFactory.createForClass(Posts);
