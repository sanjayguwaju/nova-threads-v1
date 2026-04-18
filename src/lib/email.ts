import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder')

const FROM = 'NOVA THREADS <orders@novathreads.com>'

export async function sendEmail(opts: { to: string; subject: string; react: any }) {
  try {
    await resend.emails.send({ from: FROM, ...opts })
  } catch (err) {
    console.error('email send failed', err)
  }
}
