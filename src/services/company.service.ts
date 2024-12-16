import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../db/dbsession";
import Helper from "../utils/helper";
import { ICompanyRepository } from "../repositories/company.repository";
import { IUserRepository } from "../repositories/user.repository";
import { Company, UpdateCompany } from './../dto/company';
import CompanySchema, { ICompanySchema } from "../dao/company";
import { StatusTypes, UserTypes } from "../utils/enums";
import { User } from "../dto/user";
import UserSchema, { IUserSchema } from "../dao/user";

export default interface ICompanyService {
    saveCompany(input: Company): Promise<void>;
    getCompanies(): Promise<Company[]>;
    getCompany(companyId: string): Promise<Company>;
    updateCompany(companyId: string, input: UpdateCompany): Promise<void>;
    deleteCompany(companyId: string): Promise<void>;
}

@injectable()
export class CompanyService implements ICompanyService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('ICompanyRepository') private companyRepository: ICompanyRepository,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    public async getCompanies(): Promise<Company[]> {
        return await this.companyRepository.gets();
    }

    public async getCompany(companyId: string): Promise<Company> {

        let isExist = await this.companyRepository.isExist(companyId);
        if (isExist) {
            throw new Error(`Provided company '${companyId}' does not exist`);
        }

        return await this.companyRepository.get(companyId);
    }

    public async saveCompany(input: Company): Promise<void> {

        try {
            let session: ClientSession = await DbSession.Session();
            DbSession.Start(session);

            let newItem: ICompanySchema = this.helper.convertTo<Company, ICompanySchema>(input, new CompanySchema());

            newItem = await this.companyRepository.save(newItem, session);

            if (input.contact) {

                input.contact.companyId = newItem._id;
                input.contact.userTypeId = UserTypes.Contact;
                input.contact.recordStatus = StatusTypes.Active;

                let newUser: IUserSchema = this.helper.convertTo<User, IUserSchema>(input.contact, new UserSchema());

                await this.userRepository.save(newUser, session);
            }

            await DbSession.Commit(session);
        } catch (ex: any) {
            if (ex.code === 11000) {
                throw new Error(`Company with name '${input.name}' already exist`);
            }

            throw ex;
        }

    }

    public async updateCompany(companyId: string, input: UpdateCompany): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        let newItem: ICompanySchema = await this.companyRepository.get(companyId);

        newItem = this.helper.convertTo<UpdateCompany, ICompanySchema>(input, newItem);

        await this.companyRepository.update(newItem, session);

        if (input.contact) {

            let existingUser: IUserSchema = await this.userRepository.get(input.contact.id);

            let updateUser: IUserSchema = this.helper.convertTo<User, IUserSchema>(input.contact, existingUser);

            await this.userRepository.save(updateUser, session);

        }

        await DbSession.Commit(session);
    }

    public async deleteCompany(companyId: string): Promise<void> {

        let isExist = await this.companyRepository.isExist(companyId);
        if (isExist) {
            throw new Error(`Provided company '${companyId}' does not exist`);
        }

        await this.companyRepository.delete(companyId);
    }

}