import { Resend } from "resend";
export interface IEmailService {
  sendVerificationEmail(email: string, token: string): Promise<void>;
}

// Resend implementation below
export class ResendEmailService implements IEmailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    // 1. define the verification URL
    //    hint: `${process.env.APP_URL}/api/v1/users/verify-email?token=${token}`
    // 2. send email using this.resend.emails.send()
    //    - from: "noreply@yourdomain.com"
    //    - to: email
    //    - subject: "Verify your email"
    //    - html: a simple message with the verification link
    const verificationUrl = `${process.env.APP_URL}/api/v1/users/verify-email?token=${token}`;

    const emailContent = `
      <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">Verify Email</a>
    `;

    await this.resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "Verify your email",
      html: emailContent,
    });
  }
}
