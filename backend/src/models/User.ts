import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  role: 'admin';
  createdAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['admin'],
      default: 'admin',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<IUser>('User', userSchema);
