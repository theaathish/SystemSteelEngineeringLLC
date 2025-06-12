import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Determine if this is a job application or contact form
    const isJobApplication = message.includes('Job Application for:');
    
    // For now, we'll just log the submission and return success
    // In production, you can integrate with email services like Resend, SendGrid, etc.
    console.log('Form submission:', {
      type: isJobApplication ? 'Job Application' : 'Contact Form',
      name,
      email,
      message: message.substring(0, 100) + '...',
      timestamp: new Date().toISOString()
    });

    // You can also save to a database, send to a webhook, etc.
    // For now, we'll simulate email sending
    
    const successMessage = isJobApplication 
      ? 'Thank you! Your job application has been submitted successfully. We will review it and get back to you soon.'
      : 'Thank you! Your message has been sent successfully. We will get back to you soon.';

    return NextResponse.json({
      success: true,
      message: successMessage
    });

  } catch (error) {
    console.error('Form submission error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Sorry, there was an error sending your message. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
