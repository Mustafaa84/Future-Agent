import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { applyRateLimit, RateLimitPresets, addRateLimitHeaders } from '@/lib/rate-limit';

const resend = new Resend(process.env.RESEND_API_KEY);

// ✅ SECURITY: Escape HTML special characters to prevent email injection
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export async function POST(request: NextRequest) {
  try {
    // ✅ SECURITY: Apply rate limiting - 3 requests per 5 minutes
    const rateLimitResponse = applyRateLimit(request, RateLimitPresets.CONTACT_FORM);
    if (rateLimitResponse) {
      return rateLimitResponse; // Return 429 if rate limited
    }

    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Send email via Resend
    // ✅ SECURITY: Escape all user inputs before inserting into HTML
    const safeName = escapeHtml(name)
    const safeEmail = escapeHtml(email)
    const safeSubject = escapeHtml(subject)
    const safeMessage = escapeHtml(message)

    await resend.emails.send({
      from: 'Future Agent <onboarding@resend.dev>', // Use resend's domain for testing
      to: 'roayaonline1@gmail.com', // Your email where you want to receive messages
      replyTo: email, // User's email for easy reply
      subject: `New Contact Form: ${safeSubject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #0891b2;">New Contact Form Submission</h2>
          
          <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0 0 10px 0;"><strong>From:</strong> ${safeName}</p>
            <p style="margin: 0 0 10px 0;"><strong>Email:</strong> ${safeEmail}</p>
            <p style="margin: 0 0 10px 0;"><strong>Subject:</strong> ${safeSubject}</p>
          </div>

          <div style="background: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
            <h3 style="color: #334155; margin-top: 0;">Message:</h3>
            <p style="color: #475569; line-height: 1.6; white-space: pre-wrap;">${safeMessage}</p>
          </div>

          <p style="color: #94a3b8; font-size: 12px; margin-top: 30px;">
            Sent from Future Agent contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    // ✅ Add rate limit headers to response
    const response = NextResponse.json(
      { success: true, message: 'Message sent successfully' },
      { status: 200 }
    );
    return addRateLimitHeaders(response, request, RateLimitPresets.CONTACT_FORM);
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message. Please try again or email us directly.' },
      { status: 500 }
    );
  }
}
