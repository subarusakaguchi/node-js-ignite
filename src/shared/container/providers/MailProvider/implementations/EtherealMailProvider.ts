import fs from "fs";
import handlebars from "handlebars";
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

  async sendMail({
    to,
    subject,
    variables,
    path,
  }: IMailProviderDTO): Promise<void> {
    const templateMailContent = fs.readFileSync(path).toString("utf-8");

    const templateParse = handlebars.compile(templateMailContent);

    const templateHtml = templateParse(variables);

    const message = await this.client.sendMail({
      to,
      from: "Rentx <noreply@rentx.com.br>",
      subject,
      html: templateHtml,
    });

    console.log(`Message sent to: ${message.messageId}`);

    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(message)}`);
  }
}

export { EtherealMailProvider };
