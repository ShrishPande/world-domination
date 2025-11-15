import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
