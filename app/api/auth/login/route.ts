import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username } = await request.json();
    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ message: 'Server error during login.', error }, { status: 500 });
  }
}
