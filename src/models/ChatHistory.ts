import mongoose, { Schema, Document } from 'mongoose';

export interface IChatHistory extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  subject: string;
  topic: string;
  userMessage: string;
  aiResponse: string;
  style: string;
  createdAt: Date;
}

const ChatHistorySchema = new Schema<IChatHistory>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true },
    topic: { type: String, required: true },
    userMessage: { type: String, required: true },
    aiResponse: { type: String, required: true },
    style: { type: String, default: 'simple' },
  },
  { timestamps: true }
);

ChatHistorySchema.index({ userId: 1, subject: 1, topic: 1 });

export default mongoose.models.ChatHistory || mongoose.model<IChatHistory>('ChatHistory', ChatHistorySchema);
