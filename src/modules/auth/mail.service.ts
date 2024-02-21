import { Injectable } from '@nestjs/common';
import Mailgun from 'mailgun.js';

@Injectable()
export class MailService {
  private mg;

  constructor(
  ) {
    const mailgun = new Mailgun(FormData);
    this.mg = mailgun.client({
      username: 'api',
      key: process.env.MAILGUN_API_KEY,
    })
  }

  async sendEmail(from: string, to: string, subject: string, text: string, html: string): Promise<any> {
    try {
      const response = await this.mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from,
        to,
        subject,
        text,
        html
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
}
