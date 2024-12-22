import { inject, injectable } from "inversify";
import Helper from "../utils/helper";

// Repositories
import { IUserRepository } from "../repositories/user.repository";

// Schemas
import { IUserSchema } from "../dao/user";

// DTOs
import { AuthUser, Token, TokenUser } from "../dto/user";

export default interface IAuthService {
    signin(input: AuthUser): Promise<Token>;
}

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    public async signin(input: AuthUser): Promise<Token> {

        let user: IUserSchema = await this.userRepository.getUserByEmail(input.email);

        let tokenUser: TokenUser = this.helper.convertTo<IUserSchema, TokenUser>(user, new TokenUser());

        let token = await this.helper.GenerateJwtToken(tokenUser, "id");

        return new Token({ token: token, user: { name: tokenUser.name, userTypeId: tokenUser.userTypeId } });

    }
}