import { ICreateUserTokenDTO } from "@modules/accounts/dtos/ICreateUserTokenDTO";
import { UserTokens } from "@modules/accounts/infra/typeorm/entities/UserTokens";

import { IUserTokensRepository } from "../IUserTokensRepository";

class UserTokensRepositoryInMemory implements IUserTokensRepository {
  private repository: UserTokens[];

  constructor() {
    this.repository = [];
  }

  async create({
    user_id,
    expires_date,
    refresh_token,
  }: ICreateUserTokenDTO): Promise<UserTokens> {
    const newToken = new UserTokens();

    Object.assign(newToken, {
      user_id,
      expires_date,
      refresh_token,
    });

    return newToken;
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserTokens> {
    const userToken = this.repository.find(
      (token) =>
        token.user_id === user_id && token.refresh_token === refresh_token
    );

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const index = this.repository.findIndex((token) => token.id === id);

    this.repository.splice(index, 1);
  }

  async findByRefreshToken(refresh_token: string): Promise<UserTokens> {
    return this.repository.find(
      (token) => token.refresh_token === refresh_token
    );
  }
}

export { UserTokensRepositoryInMemory };
