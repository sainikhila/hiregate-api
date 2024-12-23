import { inject, injectable } from "inversify";
import Helper from "../utils/helper";

// Repositories
import { IUserRepository } from "../repositories/user.repository";

export default interface ICandidateService {
    getAllCandidates(companyId: string): Promise<any>;
}

@injectable()
export class CandidateService implements ICandidateService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    public async getAllCandidates(companyId: string): Promise<any> {
        return await this.userRepository.getAllCompanyUser(companyId);
    }
}