import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Score from '@/models/Score';
import mongoose from 'mongoose';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { userId, score, title, analysis, finalState, date } = await request.json();
    if (!userId || !score || !title || !analysis || !finalState) {
        return NextResponse.json({ message: 'Missing required score fields.' }, { status: 400 });
    }
    
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
    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error saving score.', error }, { status: 500 });
  }
}
