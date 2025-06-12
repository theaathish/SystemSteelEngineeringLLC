import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

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

    // Create transporter with environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Determine if this is a job application or contact form
    const isJobApplication = message.includes('Job Application for:');
    const emailSubject = isJobApplication 
      ? `New Job Application from ${name}` 
      : `New Contact Message from ${name}`;

    // Send email to your designated email address
    await transporter.sendMail({
      from: `"System Steel ${isJobApplication ? 'Careers' : 'Contact'}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'aathishpirate@gmail.com',
      replyTo: email,
      subject: emailSubject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">${isJobApplication ? 'New Job Application' : 'New Contact Form Message'}</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            ${isJobApplication ? '<p><strong>Type:</strong> Job Application</p>' : ''}
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #007bff; margin: 20px 0;">
            <h3>${isJobApplication ? 'Application Details:' : 'Message:'}</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from your System Steel Engineering website ${isJobApplication ? 'careers' : 'contact'} form.
            You can reply directly to this email to respond to the ${isJobApplication ? 'applicant' : 'customer'}.
          </p>
        </div>
      `,
    });

    const successMessage = isJobApplication 
      ? 'Thank you! Your job application has been submitted successfully. We will review it and get back to you soon.'
      : 'Thank you! Your message has been sent successfully. We will get back to you soon.';

    return NextResponse.json({
      success: true,
      message: successMessage
    });

  } catch (error) {
    console.error('Email error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Sorry, there was an error sending your message. Please try again or contact us directly.' },
      { status: 500 }
    );
  }
}
