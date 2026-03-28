import mongoose, { Schema, Document } from 'mongoose';

export interface IMatch extends Document {
  _id: mongoose.Types.ObjectId;
  senderId: mongoose.Types.ObjectId;
  receiverId: mongoose.Types.ObjectId;
  matchedSkills: { senderTeaches: string[]; receiverTeaches: string[] };
  matchScore: number;
  status: 'pending' | 'accepted' | 'rejected';
  aiReason: string;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatch>(
  {
    senderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    receiverId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    matchedSkills: {
      senderTeaches: [{ type: String }],
      receiverTeaches: [{ type: String }],
    },
    matchScore: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
    aiReason: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.models.Match || mongoose.model<IMatch>('Match', MatchSchema);
