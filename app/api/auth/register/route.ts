import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import User from '@/lib/user.model';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();
    
    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: 'All fields are required.', success: false },
        { status: 400 }
      );
    }
    
    // Email validation
    if (!email.includes('@')) {
      return NextResponse.json(
        { message: 'Please enter a valid email address.', success: false },
        { status: 400 }
      );
    }
    
    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { message: 'Password must be at least 6 characters long.', success: false },
        { status: 400 }
      );
    }
    
    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: 'Email already in use.', success: false },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashed = await bcrypt.hash(password, 10);
    
    // Create user
    const user = new User({ 
      name, 
      email, 
      password: hashed, 
      role 
    });
    
    await user.save();
    
    return NextResponse.json(
      { 
        message: 'User registered successfully.', 
        success: true,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          _id: user._id
        }
      },
      { status: 201 }
    );
    
  } catch (error: unknown) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Failed to register user',
        success: false,
        error: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}