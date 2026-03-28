import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  skillsKnown: string[];
  skillsWanted: string[];
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  streak: number;
  lastActive: Date;
  xp: number;
  badges: string[];
  savedTopics: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    skillsKnown: [{ type: String, trim: true }],
    skillsWanted: [{ type: String, trim: true }],
    skillLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    xp: { type: Number, default: 0 },
    badges: [{ type: String }],
    savedTopics: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
