import Head from 'next/head'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from '../styles/Home.module.css'

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

export default function Home() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setServerError('')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const err = await res.json()
        setServerError(err.message || 'Something went wrong. Please try again.')
      }
    } catch {
      setServerError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Book the Coffee Cart — MOTW Palatine</title>
        <meta name="description" content="Reserve MOTW Coffee &amp; Pastries mobile coffee cart for your corporate event, birthday, or wedding." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.card}>

          {/* Header */}
          <div className={styles.header}>
            <div className={styles.logoRing}>
              <span>MOTW<br />COFFEE</span>
            </div>
            <h1 className={styles.title}>Book the coffee cart</h1>
            <p className={styles.subtitle}>
              Fill out the form below and we&apos;ll be in touch within 24 hours to confirm your event.
            </p>
          </div>

          {submitted ? (
            <div className={styles.success}>
              <div className={styles.successIcon}>✓</div>
              <h2>Request sent!</h2>
              <p>
                Thanks for reaching out! We&apos;ll follow up at your email address within 24 hours to
                confirm your booking.
              </p>
              <p className={styles.successContact}>
                Questions? Email us at{' '}
                <a href="mailto:M3H-MOTW@outlook.com">M3H-MOTW@outlook.com</a>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} noValidate>

              {/* Contact Info */}
              <div className={styles.sectionLabel}>Your info</div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="firstName">First name</label>
                  <input
                    id="firstName"
                    type="text"
                    placeholder="Jane"
                    autoComplete="given-name"
                    className={errors.firstName ? styles.inputError : ''}
                    {...register('firstName', { required: 'Required' })}
                  />
                  {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="lastName">Last name</label>
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Smith"
                    autoComplete="family-name"
                    className={errors.lastName ? styles.inputError : ''}
                    {...register('lastName', { required: 'Required' })}
                  />
                  {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  autoComplete="email"
                  className={errors.email ? styles.inputError : ''}
                  {...register('email', {
                    required: 'Required',
                    pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                  })}
                />
                {errors.email && <span className={styles.error}>{errors.email.message}</span>}
              </div>

              {/* Event Details */}
              <div className={styles.divider} />
              <div className={styles.sectionLabel}>Event details</div>

              <div className={styles.field}>
                <label htmlFor="location">Event location</label>
                <input
                  id="location"
                  type="text"
                  placeholder="123 Main St, Palatine, IL"
                  className={errors.location ? styles.inputError : ''}
                  {...register('location', { required: 'Required' })}
                />
                {errors.location && <span className={styles.error}>{errors.location.message}</span>}
              </div>

              <div className={styles.row}>
                <div className={styles.field}>
                  <label htmlFor="eventDate">Date</label>
                  <input
                    id="eventDate"
                    type="date"
                    className={errors.eventDate ? styles.inputError : ''}
                    {...register('eventDate', { required: 'Required' })}
                  />
                  {errors.eventDate && <span className={styles.error}>{errors.eventDate.message}</span>}
                </div>
                <div className={styles.field}>
                  <label htmlFor="eventTime">Start time</label>
                  <input
                    id="eventTime"
                    type="time"
                    className={errors.eventTime ? styles.inputError : ''}
                    {...register('eventTime', { required: 'Required' })}
                  />
                  {errors.eventTime && <span className={styles.error}>{errors.eventTime.message}</span>}
                </div>
              </div>

              <div className={styles.field}>
                <label htmlFor="duration">How long is your event?</label>
                <select
                  id="duration"
                  className={errors.duration ? styles.inputError : ''}
                  {...register('duration', { required: 'Required' })}
                >
                  <option value="">Select duration</option>
                  <option value="1 hour">1 hour</option>
                  <option value="2 hours">2 hours</option>
                  <option value="3 hours">3 hours</option>
                  <option value="4 hours">4 hours</option>
                  <option value="5 hours">5 hours</option>
                  <option value="6+ hours">6+ hours</option>
                </select>
                {errors.duration && <span className={styles.error}>{errors.duration.message}</span>}
              </div>

              {/* Comments */}
              <div className={styles.divider} />
              <div className={styles.sectionLabel}>Anything else?</div>

              <div className={styles.field}>
                <label htmlFor="comments">Additional comments</label>
                <textarea
                  id="comments"
                  placeholder="Tell us about your event, expected guest count, any special requests..."
                  rows={4}
                  {...register('comments')}
                />
              </div>

              {serverError && <p className={styles.serverError}>{serverError}</p>}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? 'Sending…' : 'Send booking request'}
              </button>
            </form>
          )}
        </div>

        <footer className={styles.footer}>
          <p>MOTW Coffee &amp; Pastries · Palatine, IL</p>
          <p><a href="mailto:M3H-MOTW@outlook.com">M3H-MOTW@outlook.com</a></p>
        </footer>
      </main>
    </>
  )
}
