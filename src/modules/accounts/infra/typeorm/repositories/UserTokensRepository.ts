import { getRepository, Repository } from "typeorm";

import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { IUserTokensRepository } from "@modules/accounts/repositories/IUserTokensRepository";

import { UserTokens } from "../entities/UserTokens";

class UserTokensRepository implements IUserTokensRepository {
  private userTokens: Repository<UserTokens>;

  constructor() {
    this.userTokens = getRepository(UserTokens);
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const newToken = this.userTokens.create({
      user_id,
      expires_date,
      refresh_token,
    });

    await this.userTokens.save(newToken);

    return newToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = await this.userTokens.findOne({ user_id, refresh_token });

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.userTokens.delete({ id });
  }
}

export { UserTokensRepository };
