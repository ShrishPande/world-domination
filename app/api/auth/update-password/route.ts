import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword) {
      return NextResponse.json({ message: 'User ID and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true, select: '-password' }
    );

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: updatedUser._id.toString(),
      username: updatedUser.username,
      isActive: updatedUser.isActive,
    });
  } catch (error) {
    console.error('Update password error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}