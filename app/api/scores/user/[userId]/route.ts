import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Score from '@/models/Score';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  await dbConnect();
  try {
    const { userId } = params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return NextResponse.json({ message: 'Invalid user ID format.' }, { status: 400 });
    }
    const scores = await Score.find({ userId: userId }).sort({ date: -1 });
    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json({ message: 'Server error fetching user scores.', error }, { status: 500 });
  }
}
