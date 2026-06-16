# MOTW Coffee Cart Booking

Event booking form for MOTW Coffee & Pastries — Palatine, IL.

Built with Next.js, deployed on Vercel.

## Setup

### Environment Variables

Set these in Vercel (Project → Settings → Environment Variables):

| Variable | Description |
|---|---|
| `SMTP_HOST` | SMTP server (default: `smtp-mail.outlook.com`) |
| `SMTP_PORT` | SMTP port (default: `587`) |
| `SMTP_USER` | Your Outlook email address |
| `SMTP_PASS` | Your Outlook password or app password |
| `NOTIFY_EMAIL` | Where booking notifications are sent (default: `M3H-MOTW@outlook.com`) |

### Local Development

```bash
npm install
cp .env.example .env.local   # fill in your SMTP credentials
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment

This project is deployed via Vercel. Push to `main` to trigger a deploy.
