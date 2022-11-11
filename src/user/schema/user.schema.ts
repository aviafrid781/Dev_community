import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UserRole } from '../model/user.type.enum';
export type UserDocument = User & Document;
@Schema({ timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } })
export class User {
  @Prop({
    type: String,
  })
  fname: string;
  @Prop({
    type: String,
  })
  lname: string;
  @Prop({
    type: String,
  })
  password: string;

  @Prop({
    type: String,
  })
  email: string;

  @Prop({
    type: String,
  })
  address: string;

  @Prop({
    type: String,
    enum: [UserRole.NormalUser, UserRole.Developer],
  })
  userType: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
