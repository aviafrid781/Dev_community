import { Document } from 'mongoose';
export interface UserI extends Document {
  fname?: string;
  lname?: string;
  email?: string;
  password?: string;
  address?: string;
  userType?: string;
  created_at?: string;
  updated_at?: string;
}
