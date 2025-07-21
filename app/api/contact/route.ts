import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/validations';
import { sendContactEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validatedData = contactFormSchema.parse(body);
    
    // Send the email
    const result = await sendContactEmail(validatedData);
    
    if (result.success) {
      return NextResponse.json(
        { message: 'Email sent successfully', id: result.data?.id },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { error: result.error || 'Failed to send email' },
        { status: 500 }
      );
    }
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