import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../db/dbsession";
import Helper from "../utils/helper";
import { IUserRepository } from "../repositories/user.repository";
import { UpdateUser, User } from "../dto/user";
import UserSchema, { IUserSchema } from "../dao/user";
import { FilterBy, ConditionTypes, Search, SearchResults } from "../dto/search";

export default interface IUserService {
    saveUser(input: User): Promise<void>;
    getUsers(companyId: string, search: Search): Promise<SearchResults>;
    getUser(companyId: string): Promise<User>;
    updateUser(companyId: string, input: UpdateUser): Promise<void>;
    deleteUser(companyId: string): Promise<void>;
}

@injectable()
export class UserService implements IUserService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    public async getUsers(companyId: string, search: Search): Promise<SearchResults> {

        let filters: FilterBy[] = search.filter || [];

        if (filters.findIndex(e => e.name === "companyId") === -1) {
            filters.push(new FilterBy().addItem("companyId", companyId, ConditionTypes.EQUALS));
        }

        search.exclude = ["__v", "password"];

        search.filter = filters;

        return await this.userRepository.search(search);
    }

    public async getUser(userId: string): Promise<User> {

        let isExist = await this.userRepository.isExist(userId);
        if (isExist) {
            throw new Error(`Provided user '${userId}' does not exist`);
        }

        return await this.userRepository.get(userId, ['__v', 'password']);
    }

    public async saveUser(input: User): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        let isExist = await this.userRepository.isExistForCompany(this.helper.toString(input.companyId), input.email);
        if (isExist) {
            throw new Error(`User with email '${input.email}' already exist`);
        }

        let newItem: IUserSchema = this.helper.convertTo<User, IUserSchema>(input, new UserSchema());

        newItem = await this.userRepository.save(newItem, session);

        await DbSession.Commit(session);
    }

    public async updateUser(userId: string, input: UpdateUser): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        let newItem: IUserSchema = await this.userRepository.get(userId);

        newItem = this.helper.convertTo<UpdateUser, IUserSchema>(input, newItem);

        await this.userRepository.update(newItem, session);

        await DbSession.Commit(session);
    }

    public async deleteUser(userId: string): Promise<void> {

        let isExist = await this.userRepository.isExist(userId);
        if (isExist) {
            throw new Error(`Provided user '${userId}' does not exist`);
        }

        await this.userRepository.delete(userId);
    }

}