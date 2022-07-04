import { IMailProviderDTO } from "../../dtos/IMailProviderDTO";
import { IMailProvider } from "../IMailProvider";

class EtheralMailProviderInMemory implements IMailProvider {
  private messages: IMailProviderDTO[];

  constructor() {
    this.messages = [];
  }

  async sendMail({
    to,
    subject,
    variables,
    path,
  }: IMailProviderDTO): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}

export { EtheralMailProviderInMemory };
