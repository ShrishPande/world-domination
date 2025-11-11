// @ts-nocheck
// Note: This is a basic server setup. In a production environment, you'd want more robust error handling, validation, and security measures like password hashing.
// This server assumes it's running in an environment where Express, Mongoose, and CORS are installed.

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- MongoDB Connection ---
// The user will provide this connection string as an environment variable.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/world_domination';

mongoose.connect(MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB.'))
  .catch(err => console.error('Connection error', err));

// --- Mongoose Schemas & Models ---
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
});

const User = mongoose.model('User', UserSchema);

const ScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  title: { type: String, required: true },
  analysis: { type: String, required: true },
  finalState: { type: Object, required: true },
  date: { type: Date, default: Date.now },
});

const Score = mongoose.model('Score', ScoreSchema);

// --- API Routes ---
const router = express.Router();

// User Authentication
router.post('/auth/signup', async (req, res) => {
  try {
    const { username } = req.body;
    if (!username || username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters long.' });
    }
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ message: 'Username already exists.' });
    }
    user = new User({ username });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during signup.', error });
  }
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error during login.', error });
  }
});

// Score Management
router.post('/scores', async (req, res) => {
  try {
    const { userId, score, title, analysis, finalState, date } = req.body;
    // Simple validation
    if (!userId || !score || !title || !analysis || !finalState) {
        return res.status(400).json({ message: 'Missing required score fields.' });
    }
    
    // Convert userId from string to ObjectId
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const newScore = new Score({ 
        userId: userObjectId, 
        score, 
        title, 
        analysis, 
        finalState, 
        date: date ? new Date(date) : new Date() 
    });
    await newScore.save();
    res.status(201).json(newScore);
  } catch (error) {
    res.status(500).json({ message: 'Server error saving score.', error });
  }
});

router.get('/scores/user/:userId', async (req, res) => {
  try {
    const scores = await Score.find({ userId: req.params.userId }).sort({ date: -1 });
    res.json(scores);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user scores.', error });
  }
});

router.get('/leaderboard', async (req, res) => {
  try {
    const highScores = await Score.aggregate([
      // Sort by score descending to easily pick the highest
      { $sort: { score: -1 } },
      // Group by user and take the first document (which is the highest score)
      {
        $group: {
          _id: '$userId',
          highScore: { $first: '$score' },
          title: { $first: '$title' },
          date: { $first: '$date' },
        }
      },
      // Join with the users collection to get usernames
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      // Deconstruct the user array
      { $unwind: '$user' },
      // Shape the final output
      {
        $project: {
          _id: 0,
          username: '$user.username',
          highScore: '$highScore',
          title: '$title',
          date: '$date',
        }
      },
      // Sort the final leaderboard
      { $sort: { highScore: -1 } }
    ]);
    res.json(highScores);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching leaderboard.', error });
  }
});

app.use('/api', router);

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
