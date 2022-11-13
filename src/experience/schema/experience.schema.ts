import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
export type ExperienceDocument = Experience & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Experience {

    @Prop({
        type: String,
    })
    companyName: string;

    @Prop({
        type: Number,
    })
    totalYear: number;
    
    @Prop({
        type: String,
    })
    stackName: string;

    @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    userId: User;
}

export const  ExperienceSchema = SchemaFactory.createForClass(Experience);
