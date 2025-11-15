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
    if (!username || username.length < 3) {
      return NextResponse.json({ message: 'Username must be at least 3 characters long.' }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists. Please choose a different one.' }, { status: 409 });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      username: username.trim(),
      password: hashedPassword
    });

    await user.save();

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
    }, { status: 201 });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json({
      message: 'Server error during signup. Please try again.'
    }, { status: 500 });
  }
}
