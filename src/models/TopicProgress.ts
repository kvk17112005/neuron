import mongoose, { Schema, Document } from 'mongoose';

export interface ITopicProgress extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  status: 'not-started' | 'in-progress' | 'completed';
  quizScore: number;
  weaknessLevel: 'none' | 'low' | 'medium' | 'high';
  timeSpent: number;
  completedAt: Date | null;
  updatedAt: Date;
}

const TopicProgressSchema = new Schema<ITopicProgress>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    status: { type: String, enum: ['not-started', 'in-progress', 'completed'], default: 'not-started' },
    quizScore: { type: Number, default: 0 },
    weaknessLevel: { type: String, enum: ['none', 'low', 'medium', 'high'], default: 'none' },
    timeSpent: { type: Number, default: 0 },
    completedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

TopicProgressSchema.index({ userId: 1, subject: 1, topic: 1 }, { unique: true });

export default mongoose.models.TopicProgress || mongoose.model<ITopicProgress>('TopicProgress', TopicProgressSchema);
