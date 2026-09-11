import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  private readonly resend: Resend | null;
  private readonly from: string;
  private readonly publicUrl: string;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('mail.resendApiKey');
    this.resend = apiKey ? new Resend(apiKey) : null;
    this.from = this.configService.get<string>('mail.from');
    this.publicUrl = this.configService.get<string>('mail.publicUrl');
  }

  async sendVerificationEmail(to: string, token: string) {
    const verifyUrl = `${this.publicUrl}/api/v1/auth/verify-email?token=${token}`;

    const subject = 'Confirm your email — Macro Counter';
    const html = `
      <div style="background:#0B0F14;color:#E2E8F0;padding:32px;font-family:system-ui,sans-serif;">
        <h1 style="color:#38BDF8;">Confirm your email</h1>
        <p>Thanks for signing up. Please confirm your email address to activate your account:</p>
        <p style="margin:24px 0;">
          <a href="${verifyUrl}" style="background:#0EA5E9;color:#FFFFFF;padding:12px 24px;text-decoration:none;border-radius:6px;">
            Confirm Email
          </a>
        </p>
        <p style="color:#94A3B8;font-size:12px;">If you didn't sign up for this, you can ignore this email. The link expires in 24 hours.</p>
      </div>
    `;

    if (!this.resend) {
      this.logger.warn(
        `RESEND_API_KEY not configured — verification link for ${to}: ${verifyUrl}`,
      );
      return;
    }

    const { error } = await this.resend.emails.send({ from: this.from, to, subject, html });

    if (error) {
      this.logger.error(
        `Failed to send verification email to ${to}: ${error.message} — link: ${verifyUrl}`,
      );
    }
  }
}
