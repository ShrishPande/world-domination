import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username } = await request.json();
    if (!username || username.length < 3) {
      return NextResponse.json({ message: 'Username must be at least 3 characters long.' }, { status: 400 });
    }
    let user = await User.findOne({ username });
    if (user) {
      return NextResponse.json({ message: 'Username already exists.' }, { status: 409 });
    }
    user = new User({ username });
    await user.save();
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error during signup.', error }, { status: 500 });
  }
}
