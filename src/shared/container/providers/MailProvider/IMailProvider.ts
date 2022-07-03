import { IMailProviderDTO } from "../dtos/IMailProviderDTO";

interface IMailProvider {
  sendMail(data: IMailProviderDTO): Promise<void>;
}

export { IMailProvider };
