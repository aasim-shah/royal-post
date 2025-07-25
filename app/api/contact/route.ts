import { NextRequest, NextResponse } from 'next/server';
import { sendRoyalPostEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
  //  dummy

  return NextResponse.json({ message: 'Contact form submitted successfully' }, { status: 200 });

  } catch (error) {
    console.error('Contact form error:', error);
    
    if (error instanceof Error) {
      // Validation error
      if (error.name === 'ZodError') {
        return NextResponse.json(
          { error: 'Invalid form data', details: error.message },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}