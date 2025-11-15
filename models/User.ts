import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
  password: { type: String, required: true, minlength: 6 },
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
