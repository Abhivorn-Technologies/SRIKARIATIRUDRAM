import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@srikariatirudram.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    if (
      !email ||
      !password ||
      email.trim().toLowerCase() !== adminEmail.trim().toLowerCase() ||
      password.trim() !== adminPassword.trim()
    ) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin email or password.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: 'admin_1',
        name: 'Administrator',
        email: adminEmail,
      },
    });
  } catch (error: any) {
    console.error('Admin authentication error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Authentication server error' },
      { status: 500 }
    );
  }
}
