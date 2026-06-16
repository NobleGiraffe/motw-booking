import Head from 'next/head'
import Image from 'next/image'
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
        window.scrollTo({ top: 0, behavior: 'smooth' })
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
        <title>Book the Coffee Cart — MOTW Coffee & Pastries, Palatine</title>
        <meta name="description" content="Reserve the MOTW mobile espresso cart for your corporate event, birthday, or wedding in the Palatine, IL area." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="Book the MOTW Coffee Cart" />
        <meta property="og:description" content="Premium mobile espresso service for corporate events, birthdays & weddings." />
        <meta property="og:image" content="/motw-cart-1.png" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ── NAV ── */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.navLogo}>
            <span className={styles.navLogoText}>MOTW</span>
            <span className={styles.navLogoSub}>COFFEE & PASTRIES</span>
          </div>
          <a href="#book" className={styles.navCta}>Book Now</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroGrid}>
          <div className={styles.heroLeft}>
            <p className={styles.heroEyebrow}>Mobile Espresso · Palatine, IL</p>
            <h1 className={styles.heroTitle}>
              Elevate your event with specialty coffee
            </h1>
            <p className={styles.heroBody}>
              MOTW brings a fully equipped espresso bar to your door. From intimate birthdays to large corporate events — we handle the coffee so you can enjoy the moment.
            </p>
            <div className={styles.heroTags}>
              <span>☕ Corporate Events</span>
              <span>🎂 Birthdays</span>
              <span>💍 Weddings</span>
            </div>
            <a href="#book" className={styles.heroCta}>Reserve Your Date</a>
          </div>
          <div className={styles.heroRight}>
            <div className={styles.heroImgMain}>
              <Image src="/motw-cart-1.png" alt="MOTW coffee cart setup" fill style={{ objectFit: 'cover' }} priority />
            </div>
            <div className={styles.heroImgSide}>
              <div className={styles.heroImgSmall}>
                <Image src="/motw-cart-2.png" alt="MOTW coffee cart at event" fill style={{ objectFit: 'cover' }} />
              </div>
              <div className={styles.heroImgSmall}>
                <Image src="/motw-cart-3.png" alt="MOTW coffee cart panda cafe" fill style={{ objectFit: 'cover' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT WE OFFER ── */}
      <section className={styles.features}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>What we offer</p>
          <h2 className={styles.sectionTitle}>The full café experience, wherever you need it</h2>
          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>☕</div>
              <h3>Specialty Espresso</h3>
              <p>Lattes, cappuccinos, cortados, and more — made fresh with a professional Fiamma espresso machine.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🍦</div>
              <h3>Custom Flavors</h3>
              <p>Lavender, caramel, hazelnut, vanilla, white chocolate — we tailor the menu to your event.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚗</div>
              <h3>We Come to You</h3>
              <p>Fully self-contained cart with wheels. Indoor, outdoor, any venue — we set up and break down ourselves.</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎉</div>
              <h3>Any Occasion</h3>
              <p>Corporate meetings, product launches, birthday parties, bridal showers, and wedding receptions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── GALLERY ── */}
      <section className={styles.gallery}>
        <div className={styles.container}>
          <p className={styles.sectionEyebrow}>In action</p>
          <h2 className={styles.sectionTitle}>Seen at events across Palatine</h2>
          <div className={styles.galleryGrid}>
            <div className={styles.galleryItem + ' ' + styles.galleryLarge}>
              <Image src="/motw-cart-3.png" alt="MOTW at a local cafe popup" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.galleryItem}>
              <Image src="/motw-cart-1.png" alt="MOTW espresso setup" fill style={{ objectFit: 'cover' }} />
            </div>
            <div className={styles.galleryItem}>
              <Image src="/motw-cart-2.png" alt="MOTW at outdoor event" fill style={{ objectFit: 'cover' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── BOOKING FORM ── */}
      <section className={styles.bookSection} id="book">
        <div className={styles.container}>
          <div className={styles.bookLayout}>

            {/* Left — info panel */}
            <div className={styles.bookInfo}>
              <p className={styles.sectionEyebrow}>Get in touch</p>
              <h2 className={styles.bookInfoTitle}>Ready to book?</h2>
              <p className={styles.bookInfoBody}>
                Fill out the form and we&apos;ll confirm availability and details within 24 hours.
              </p>
              <div className={styles.contactList}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📧</span>
                  <a href="mailto:M3H-MOTW@outlook.com">M3H-MOTW@outlook.com</a>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📍</span>
                  <span>Palatine, IL & surrounding areas</span>
                </div>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon}>📸</span>
                  <span>@MOTWPalatine</span>
                </div>
              </div>
              <div className={styles.bookImgWrap}>
                <Image src="/motw-promo.png" alt="MOTW coffee cart promo" fill style={{ objectFit: 'cover', borderRadius: '12px' }} />
              </div>
            </div>

            {/* Right — form */}
            <div className={styles.formCard}>
              {submitted ? (
                <div className={styles.success}>
                  <div className={styles.successIcon}>✓</div>
                  <h2>Request sent!</h2>
                  <p>
                    Thanks for reaching out! We&apos;ll follow up at your email within 24 hours to confirm your booking.
                  </p>
                  <p className={styles.successContact}>
                    Questions? <a href="mailto:M3H-MOTW@outlook.com">M3H-MOTW@outlook.com</a>
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                  <h3 className={styles.formTitle}>Booking request</h3>

                  <div className={styles.formSectionLabel}>Your info</div>
                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="firstName">First name</label>
                      <input id="firstName" type="text" placeholder="Jane" autoComplete="given-name"
                        className={errors.firstName ? styles.inputError : ''}
                        {...register('firstName', { required: 'Required' })} />
                      {errors.firstName && <span className={styles.error}>{errors.firstName.message}</span>}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="lastName">Last name</label>
                      <input id="lastName" type="text" placeholder="Smith" autoComplete="family-name"
                        className={errors.lastName ? styles.inputError : ''}
                        {...register('lastName', { required: 'Required' })} />
                      {errors.lastName && <span className={styles.error}>{errors.lastName.message}</span>}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="email">Email</label>
                    <input id="email" type="email" placeholder="jane@example.com" autoComplete="email"
                      className={errors.email ? styles.inputError : ''}
                      {...register('email', {
                        required: 'Required',
                        pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Enter a valid email' },
                      })} />
                    {errors.email && <span className={styles.error}>{errors.email.message}</span>}
                  </div>

                  <div className={styles.formSectionLabel}>Event details</div>

                  <div className={styles.field}>
                    <label htmlFor="location">Event location</label>
                    <input id="location" type="text" placeholder="123 Main St, Palatine, IL"
                      className={errors.location ? styles.inputError : ''}
                      {...register('location', { required: 'Required' })} />
                    {errors.location && <span className={styles.error}>{errors.location.message}</span>}
                  </div>

                  <div className={styles.row}>
                    <div className={styles.field}>
                      <label htmlFor="eventDate">Date</label>
                      <input id="eventDate" type="date"
                        className={errors.eventDate ? styles.inputError : ''}
                        {...register('eventDate', { required: 'Required' })} />
                      {errors.eventDate && <span className={styles.error}>{errors.eventDate.message}</span>}
                    </div>
                    <div className={styles.field}>
                      <label htmlFor="eventTime">Start time</label>
                      <input id="eventTime" type="time"
                        className={errors.eventTime ? styles.inputError : ''}
                        {...register('eventTime', { required: 'Required' })} />
                      {errors.eventTime && <span className={styles.error}>{errors.eventTime.message}</span>}
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="duration">Event duration</label>
                    <select id="duration"
                      className={errors.duration ? styles.inputError : ''}
                      {...register('duration', { required: 'Required' })}>
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

                  <div className={styles.formSectionLabel}>Anything else?</div>
                  <div className={styles.field}>
                    <label htmlFor="comments">Additional comments</label>
                    <textarea id="comments" rows={4}
                      placeholder="Guest count, event type, special requests..."
                      {...register('comments')} />
                  </div>

                  {serverError && <p className={styles.serverError}>{serverError}</p>}

                  <button type="submit" className={styles.submitBtn} disabled={loading}>
                    {loading ? 'Sending…' : 'Send booking request →'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerLogo}>
            <span>MOTW</span>
            <span className={styles.footerLogoSub}>COFFEE & PASTRIES</span>
          </div>
          <p>Palatine, IL · <a href="mailto:M3H-MOTW@outlook.com">M3H-MOTW@outlook.com</a></p>
          <p className={styles.footerCopy}>© {new Date().getFullYear()} MOTW Coffee & Pastries. All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
