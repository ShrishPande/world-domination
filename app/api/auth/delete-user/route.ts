import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import connectToDatabase from '@/lib/mongodb';

export async function DELETE(request: NextRequest) {
  try {
    await connectToDatabase();

    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    // Soft delete by setting isActive to false
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
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
    console.error('Delete user error:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}