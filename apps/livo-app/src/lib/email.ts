import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

const from = process.env.RESEND_FROM_EMAIL || 'LYSMA Solutions <lysmasolutions@gmail.com>'

export async function sendTransactionalEmail(input: {
  to: string
  subject: string
  html: string
}) {
  if (!resend) {
    if (process.env.NODE_ENV !== 'production') {
      console.info('[email:dev]', input.subject, input.to)
      console.info(input.html)
      return
    }
    throw new Error('RESEND_API_KEY manquant : impossible d’envoyer l’email transactionnel.')
  }

  const result = await resend.emails.send({
    from,
    to: input.to,
    subject: input.subject,
    html: input.html,
  })

  if (result.error) {
    throw new Error(result.error.message || 'Erreur Resend lors de l’envoi de l’email.')
  }
}
