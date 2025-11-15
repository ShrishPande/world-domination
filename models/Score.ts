import mongoose from 'mongoose';

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  title: { type: String, required: true },
  analysis: { type: String, required: true },
  finalState: { type: Object, required: true },
  date: { type: Date, default: Date.now },
});

export default mongoose.models.Score || mongoose.model('Score', ScoreSchema);
