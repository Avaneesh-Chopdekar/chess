import mongoose, { Schema, Document, Model } from 'mongoose';

export interface RefreshToken {
  token: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends Document {
  email: string;
  name?: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  refreshTokens: RefreshToken[];
}

const RefreshTokenSchema = new Schema<RefreshToken>(
  {
    token: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    name: { type: String },
    password: { type: String, required: true },
    refreshTokens: [RefreshTokenSchema], // embedded subdocuments
  },
  { timestamps: true },
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
