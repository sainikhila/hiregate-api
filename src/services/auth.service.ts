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
    getLoggedInUser(contactId: string): Promise<any>;
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

        return await this.helper.GenerateJwtToken(tokenUser, "id");

    }

    public async getLoggedInUser(contactId: string): Promise<any> {
        return await this.userRepository.getLoggedInUser(contactId);
    }
}