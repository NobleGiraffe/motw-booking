# MOTW Coffee Cart Booking

Event booking form for MOTW Coffee & Pastries — Palatine, IL.

Built with Next.js, deployed on Vercel. Email is sent via [Resend](https://resend.com).

## Setup

### Environment Variables

Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your Resend API key (from resend.com/api-keys) |
| `FROM_EMAIL` | Sender address, e.g. `MOTW Coffee <bookings@motwpalatine.com>` — must be on a domain verified in Resend, or use the default `onboarding@resend.dev` for testing |
| `NOTIFY_EMAIL` | Where booking notifications are sent (default: `M3H-MOTW@outlook.com`) |

### Why Resend instead of Outlook SMTP?

Microsoft has disabled basic SMTP authentication for this Outlook account
(`535 5.7.139 Authentication unsuccessful, basic authentication is disabled`),
which is increasingly common for Microsoft consumer/business accounts. Resend
is a transactional email API built for this exact use case — it's free for
this volume and bypasses the SMTP auth issue entirely. Notification emails
still land in the same M3H-MOTW@outlook.com inbox; only the sending method
changed.

### Local Development

```bash
npm install
cp .env.example .env.local   # fill in your Resend API key
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This project is deployed via Vercel. Push to `main` to trigger a deploy.
