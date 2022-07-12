import { SES } from "aws-sdk";
import fs from "fs";
import handlebars from "handlebars";
import nodemailer, { Transporter } from "nodemailer";
import { injectable } from "tsyringe";

import { IMailProvider } from "../IMailProvider";
import { IMailProviderDTO } from "../IMailProviderDTO";

@injectable()
class SESMailProvider implements IMailProvider {
  private client: Transporter;

  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: "2010-12-01",
        region: process.env.AWS_REGION,
      }),
    });
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

export { SESMailProvider };
