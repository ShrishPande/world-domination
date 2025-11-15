import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Score from '@/models/Score';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const userId = searchParams.get('userId'); // for getting user rank

    const skip = (page - 1) * limit;

    // Get total count for pagination
    const totalHighScores = await Score.aggregate([
      { $sort: { score: -1 } },
      {
        $group: {
          _id: '$userId',
          highScore: { $first: '$score' },
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
      { $match: { 'user.isActive': { $ne: false } } }, // Only active users
      { $count: 'total' }
    ]);

    const total = totalHighScores[0]?.total || 0;

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
      { $match: { 'user.isActive': { $ne: false } } }, // Only active users
      {
        $project: {
          _id: 0,
          userId: '$_id',
          username: '$user.username',
          highScore: '$highScore',
          title: '$title',
          date: '$date',
        }
      },
      { $sort: { highScore: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    // Get user rank if userId provided
    let userRank = null;
    if (userId) {
      const userRankResult = await Score.aggregate([
        { $sort: { score: -1 } },
        {
          $group: {
            _id: '$userId',
            highScore: { $first: '$score' },
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
        { $match: { 'user.isActive': { $ne: false } } },
        { $sort: { highScore: -1 } },
        {
          $group: {
            _id: null,
            scores: {
              $push: {
                userId: '$_id',
                highScore: '$highScore'
              }
            }
          }
        },
        {
          $project: {
            rank: {
              $indexOfArray: ['$scores.userId', userId]
            }
          }
        }
      ]);

      if (userRankResult.length > 0) {
        userRank = userRankResult[0].rank + 1; // 1-based rank
      }
    }

    return NextResponse.json({
      leaderboard: highScores,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      userRank
    });
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching leaderboard.', error }, { status: 500 });
  }
}
