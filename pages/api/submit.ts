import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

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

  if (!process.env.RESEND_API_KEY) {
    console.error('Missing RESEND_API_KEY environment variable')
    return res.status(500).json({ message: 'Email service is not configured. Please contact us directly.' })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

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

  const htmlBody = `
    <div style="font-family: -apple-system, sans-serif; max-width: 560px; margin: 0 auto; color: #1a1a1a;">
      <div style="background: #1a1a1a; padding: 24px; text-align: center; border-radius: 8px 8px 0 0;">
        <p style="color: #fff; font-size: 13px; font-weight: 600; letter-spacing: 0.12em; margin: 0;">MOTW COFFEE</p>
      </div>
      <div style="border: 1px solid #e8e4df; border-top: none; border-radius: 0 0 8px 8px; padding: 28px;">
        <h2 style="font-size: 18px; margin: 0 0 6px;">New booking request</h2>
        <p style="color: #888; font-size: 13px; margin: 0 0 24px;">Submitted via motwpalatine.com</p>

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

  const customerHtml = `
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
  `

  try {
    // Notify MOTW — sent from Resend's domain, replies go to the customer
    const notifyResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'MOTW Bookings <onboarding@resend.dev>',
      to: process.env.NOTIFY_EMAIL || 'M3H-MOTW@outlook.com',
      reply_to: email,
      subject: `New booking request — ${firstName} ${lastName} · ${formattedDate}`,
      html: htmlBody,
    })

    if (notifyResult.error) {
      console.error('Resend notify error:', notifyResult.error)
      return res.status(500).json({ message: 'Failed to send email. Please try again or contact us directly.' })
    }

    // Auto-reply to customer
    const replyResult = await resend.emails.send({
      from: process.env.FROM_EMAIL || 'MOTW Coffee <onboarding@resend.dev>',
      to: email,
      subject: 'We received your booking request — MOTW Coffee',
      html: customerHtml,
    })

    if (replyResult.error) {
      // Notify succeeded but auto-reply failed — still a success for the user
      console.error('Resend customer auto-reply error:', replyResult.error)
    }

    return res.status(200).json({ message: 'Success' })
  } catch (err) {
    console.error('Email send error:', err)
    return res.status(500).json({ message: 'Failed to send email. Please try again or contact us directly.' })
  }
}
