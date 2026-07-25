import nodemailer from 'nodemailer'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { message, email } = req.body

  if (!message) {
    return res.status(400).json({ error: 'Meddelande saknas' })
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `Byggio Feedback <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER,
      subject: 'Ny feedback från Byggio',
      html: `<p><strong>Meddelande:</strong></p><p>${message}</p><p><strong>Från:</strong> ${email ?? 'Ej inloggad användare'}</p>`,
    })

    return res.status(200).json({ success: true })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Kunde inte skicka e-post' })
  }
}