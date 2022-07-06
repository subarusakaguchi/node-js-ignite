import { IMailProviderDTO } from "./IMailProviderDTO";

interface IMailProvider {
  sendMail(data: IMailProviderDTO): Promise<void>;
}

export { IMailProvider };
