import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

/**
 * Registration API Route
 *
 * Creates a new user with email/password credentials
 * - Validates input
 * - Checks for existing email
 * - Hashes password with bcrypt
 * - Inserts user into database
 */

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(request: Request) {
  try {
    const body: RegisterRequest = await request.json();

    // Validate input
    if (!body.email || !body.password || !body.name) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate password strength (min 8 characters)
    if (body.password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, body.email))
      .limit(1);

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(body.password, 10);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        name: body.name,
        email: body.email,
        password: hashedPassword,
        emailVerified: null,
        image: null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: newUser[0].id,
          name: newUser[0].name,
          email: newUser[0].email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
