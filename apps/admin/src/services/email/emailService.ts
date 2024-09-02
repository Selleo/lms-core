import nodemailer from "nodemailer";

type SendEmailProps = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

const config = {
  smtpHost: process.env.SMTP_HOST,
  smtpPort: Number(process.env.SMTP_PORT || 465),
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
  emailAdapter: process.env.EMAIL_ADAPTER,
};

const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465,
  ignoreTLS: true,
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

export async function sendEmail({ to, subject, text, html }: SendEmailProps) {
  const mailOptions = {
    from: config.smtpUser,
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
}
