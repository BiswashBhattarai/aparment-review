const nodemailer = require('nodemailer');
const { EMAIL_FROM, SENDGRID_API_KEY } = process.env;

async function sendVerificationEmail(to, token) {
  // If SENDGRID_API_KEY is configured you can integrate properly. For now we log the verification URL.
  const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify-email?token=${token}`;
  console.log(`Send verification email to ${to}: ${verificationUrl}`);

  // Try to send via nodemailer if SMTP is configured (simple fallback)
  if (process.env.SMTP_HOST) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    await transporter.sendMail({
      from: EMAIL_FROM || 'noreply@example.com',
      to,
      subject: 'Verify your email',
      text: `Verify: ${verificationUrl}`,
      html: `<p>Click to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`
    });
  }
}

module.exports = { sendVerificationEmail };
