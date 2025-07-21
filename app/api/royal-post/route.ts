export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { royalPostFormSchema } from '@/lib/validations';
import { sendRoyalPostEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = royalPostFormSchema.parse(body);
    
    const emailData = {
      ...validatedData,
      photo1: body.photo1,
      photo2: body.photo2,
    };
    
    const result = await sendRoyalPostEmail(emailData);
    
    if (result.success) {
      return NextResponse.json({ message: 'Form submitted successfully', id: "sdfaf" }, { status: 200 });
    }
    
    return NextResponse.json({ error: result.error || 'Failed to submit form' }, { status: 500 });

  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid form data', details: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal server error' }, { status: 500 });
  }
}
