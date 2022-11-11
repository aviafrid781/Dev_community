import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/user/schema/user.schema';
export type SkillsDocument = Skills & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Skills {
 
  @Prop({
    type: String,
  })
  skillsName: string;

  @Prop({
    type: Number,
  })
  experience: number;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
   userId: User;
}

export const SkillsSchema = SchemaFactory.createForClass(Skills);
