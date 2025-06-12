import { NextRequest, NextResponse } from 'next/server';
import * as nodemailer from 'nodemailer';

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

    // Log the submission
    console.log('\n=== NEW CONTACT FORM SUBMISSION ===');
    console.log('Timestamp:', new Date().toLocaleString());
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Message:', message);
    console.log('===================================\n');

    // Create SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Verify SMTP connection
    await transporter.verify();

    // Parse multiple email recipients from environment variable
    const contactEmails = process.env.CONTACT_EMAIL 
      ? process.env.CONTACT_EMAIL.split(',').map(email => email.trim())
      : ['aathihacker2004@gmail.com'];

    // Add CC recipients if specified
    const ccEmails = process.env.CONTACT_CC_EMAILS 
      ? process.env.CONTACT_CC_EMAILS.split(',').map(email => email.trim())
      : [];

    // Add BCC recipients if specified  
    const bccEmails = process.env.CONTACT_BCC_EMAILS 
      ? process.env.CONTACT_BCC_EMAILS.split(',').map(email => email.trim())
      : [];

    console.log('Sending email to:', {
      to: contactEmails,
      cc: ccEmails,
      bcc: bccEmails
    });

    // Send email to multiple recipients
    const mailOptions = {
      from: `"System Steel Contact Form" <${process.env.SMTP_USER}>`,
      to: contactEmails,
      cc: ccEmails.length > 0 ? ccEmails : undefined,
      bcc: bccEmails.length > 0 ? bccEmails : undefined,
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9;">System Steel Engineering Website</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Name:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><a href="mailto:${email}">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;"><strong>Date:</strong></td>
                  <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${new Date().toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0;"><strong>Recipients:</strong></td>
                  <td style="padding: 10px 0;">${contactEmails.join(', ')}</td>
                </tr>
              </table>
            </div>
            
            <div style="background: white; padding: 25px; border-radius: 8px;">
              <h2 style="color: #333; margin-top: 0;">Message</h2>
              <div style="background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff;">
                <p style="margin: 0; line-height: 1.6; color: #555;">${message.replace(/\n/g, '<br>')}</p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                To reply to this message, simply respond to this email or contact ${name} directly at 
                <a href="mailto:${email}" style="color: #007bff;">${email}</a>
              </p>
              <p style="color: #888; font-size: 12px; margin: 10px 0 0 0;">
                This email was sent to: ${contactEmails.join(', ')}
                ${ccEmails.length > 0 ? `<br>CC: ${ccEmails.join(', ')}` : ''}
                ${bccEmails.length > 0 ? `<br>BCC: ${bccEmails.length} recipient(s)` : ''}
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Date: ${new Date().toLocaleString()}
Recipients: ${contactEmails.join(', ')}

Message:
${message}

---
Reply to: ${email}
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${contactEmails.length} recipient(s) via SMTP`);

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully. We will get back to you soon.',
      recipients: contactEmails.length
    });

  } catch (error) {
    console.error('SMTP Error:', error);
    
    let errorMessage = 'Sorry, there was an error sending your message.';
    
    if (error instanceof Error) {
      if (error.message.includes('Invalid login')) {
        errorMessage = 'Email service configuration error. Please contact us directly.';
      } else if (error.message.includes('authentication')) {
        errorMessage = 'Email authentication failed. Please contact us directly.';
      } else if (error.message.includes('Invalid mail command')) {
        errorMessage = 'Invalid email address configuration. Please contact us directly.';
      }
    }
    
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
