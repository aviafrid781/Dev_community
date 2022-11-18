import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from '../../user/schema/user.schema';
export type SkillsDocument = Skills & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class Skills {
 
  @Prop({
    type: String,
  })
  skillsName: string;

  @Prop({
    type: String,
  })
  expertise: string;

   @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
   userId: User;
}

export const SkillsSchema = SchemaFactory.createForClass(Skills);
