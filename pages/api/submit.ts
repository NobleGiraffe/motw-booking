import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

type FormData = {
  firstName: string
  lastName: string
  email: string
  location: string
  eventDate: string
  eventTime: string
  duration: string
  comments: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const {
    firstName,
    lastName,
    email,
    location,
    eventDate,
    eventTime,
    duration,
    comments,
  }: FormData = req.body

  // Basic validation
  if (!firstName || !lastName || !email || !location || !eventDate || !eventTime || !duration) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email address' })
  }

  // Format date for display
  const formattedDate = new Date(eventDate + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Format time for display
  const [hours, minutes] = eventTime.split(':')
  const hour = parseInt(hours)
  const ampm = hour >= 12 ? 'PM' : 'AM'
  const displayHour = hour % 12 || 12
  const formattedTime = `${displayHour}:${minutes} ${ampm}`

  // Email transport — uses env vars set in Vercel
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp-mail.outlook.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: { ciphers: 'SSLv3' },
  })

  const htmlBody = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #1a1a1a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <p style="color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.12em; margin: 0;">MOTW COFFEE</p>
      </div>
      <div style="border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">
        <h2 style="font-size: 18px; margin: 0 0 6px;">New booking request</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 24px;">Submitted via motwcoffee.com</p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666; width: 40%;">Name</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; font-weight: 500;">${firstName} ${lastName}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666;">Email</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8;"><a href="mailto:${email}" style="color: #1a1a1a;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666;">Location</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8;">${location}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666;">Date</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8;">${formattedDate}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666;">Start time</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8;">${formattedTime}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8; color: #666;">Duration</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f0ece8;">${duration}</td>
          </tr>
          ${comments ? `
          <tr>
            <td style="padding: 10px 0; color: #666; vertical-align: top;">Comments</td>
            <td style="padding: 10px 0; line-height: 1.6;">${comments.replace(/\n/g, '<br>')}</td>
          </tr>` : ''}
        </table>

        <div style="margin-top: 24px; padding: 16px; background: #f7f5f2; border-radius: 8px; font-size: 13px; color: #666;">
          Reply directly to this email to respond to ${firstName}.
        </div>
      </div>
    </div>
  `

  try {
    // Notify MOTW
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: process.env.NOTIFY_EMAIL || 'M3H-MOTW@outlook.com',
      replyTo: email,
      subject: `New booking request — ${firstName} ${lastName} · ${formattedDate}`,
      html: htmlBody,
    })

    // Auto-reply to customer
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'We received your booking request — MOTW Coffee',
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
          <div style="background: #1a1a1a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
            <p style="color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.12em; margin: 0;">MOTW COFFEE</p>
          </div>
          <div style="border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">
            <h2 style="font-size: 18px; margin: 0 0 12px;">Thanks, ${firstName}!</h2>
            <p style="font-size: 14px; line-height: 1.7; color: #444;">
              We received your coffee cart booking request for <strong>${formattedDate}</strong> at <strong>${formattedTime}</strong>.
              We'll be in touch within 24 hours to confirm the details.
            </p>
            <p style="font-size: 14px; line-height: 1.7; color: #444; margin-top: 12px;">
              In the meantime, feel free to reach us at
              <a href="mailto:M3H-MOTW@outlook.com" style="color: #1a1a1a;">M3H-MOTW@outlook.com</a>
              or find us on Instagram <strong>@MOTWPalatine</strong>.
            </p>
          </div>
        </div>
      `,
    })

    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ message: 'Failed to send email. Please try again or contact us directly.' })
  }
}
