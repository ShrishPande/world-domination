import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Score from '@/models/Score';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET() {
  await dbConnect();
  try {
    const highScores = await Score.aggregate([
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$userId',
          highScore: { $first: '$score' },
          title: { $first: '$title' },
          date: { $first: '$date' },
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 0,
          username: '$user.username',
          highScore: '$highScore',
          title: '$title',
          date: '$date',
        }
      },
      { $sort: { highScore: -1 } }
    ]);
    return NextResponse.json(highScores);
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching leaderboard.', error }, { status: 500 });
  }
}
