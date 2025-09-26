import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { username, password } = requestBody;

    // Validate required fields
    if (!username || !password) {
      return NextResponse.json({ 
        error: 'Username and password are required',
        code: 'MISSING_REQUIRED_FIELDS' 
      }, { status: 400 });
    }

    // Validate fields are non-empty after trimming
    if (username.trim() === '' || password.trim() === '') {
      return NextResponse.json({ 
        error: 'Username and password are required',
        code: 'EMPTY_FIELDS' 
      }, { status: 400 });
    }

    // Query user by username
    const userResult = await db.select()
      .from(users)
      .where(eq(users.username, username.trim()))
      .limit(1);

    if (userResult.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS' 
      }, { status: 401 });
    }

    const user = userResult[0];

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return NextResponse.json({ 
        error: 'Invalid credentials',
        code: 'INVALID_CREDENTIALS' 
      }, { status: 401 });
    }

    // Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { 
        userId: user.id, 
        role: user.role 
      },
      jwtSecret,
      { 
        expiresIn: '24h' 
      }
    );

    // Return success response
    return NextResponse.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    }, { status: 200 });

  } catch (error) {
    console.error('POST login error:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      code: 'INTERNAL_ERROR' 
    }, { status: 500 });
  }
}