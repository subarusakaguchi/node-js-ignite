import nodemailer, { Transporter } from "nodemailer";

import { IMailProviderDTO } from "../../dtos/IMailProviderDTO";
import { IMailProvider } from "../IMailProvider";

class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    nodemailer
      .createTestAccount()
      .then((acc) => {
        const tranporter = nodemailer.createTransport({
          host: acc.smtp.host,
          port: acc.smtp.port,
          secure: acc.smtp.secure,
          auth: {
            user: acc.user,
            pass: acc.pass,
          },
        });

        this.client = tranporter;
      })
      .catch((error) => console.log(error));
  }

  async sendMail({ to, subject, body }: IMailProviderDTO): Promise<void> {
    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreply@rentx.com.br>",
      subject,
      text: body,
      html: body,
    });

    console.log(`Message sent to: ${message.messageId}`);

    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export { EtherealMailProvider };
