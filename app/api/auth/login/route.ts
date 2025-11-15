import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, password } = await request.json();

    // Validation
    if (!username || !password) {
      return NextResponse.json({ message: 'Username and password are required.' }, { status: 400 });
    }

    // Find user
    const user = await User.findOne({ username: username.trim() });
    if (!user) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: 'Invalid username or password.' }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'fallback-secret-key',
      { expiresIn: '7d' }
    );

    // Return user data and token (exclude password)
    const userResponse = {
      id: user._id,
      username: user.username
    };

    return NextResponse.json({
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      message: 'Server error during login. Please try again.'
    }, { status: 500 });
  }
}
