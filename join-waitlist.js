import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = request.body;

    if (!email) {
      return response.status(400).json({ error: 'Email is required' });
    }

    const data = await resend.emails.send({
      from: 'Billopsy Waitlist <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL, 
      subject: 'New Waitlist Sign-up',
      html: `<p>A new user has joined the waitlist:</p><p><strong>${email}</strong></p>`
    });

    return response.status(200).json({ message: 'Success', data });
  } catch (error) {
    console.error('Resend Error:', error);
    return response.status(500).json({ error: 'Failed to send email' });
  }
}