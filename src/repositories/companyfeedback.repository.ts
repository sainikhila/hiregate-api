import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import CompanyFeedBackSchema, { ICompanyFeedBackSchema } from "../dao/companyfeedback";

/**
 * Interface representing a repository for managing job data.
 */
export interface ICompanyFeedBackRepository {

    gets(companyId: string | undefined): Promise<ICompanyFeedBackSchema[]>;

    saveMany(input: ICompanyFeedBackSchema[], session: ClientSession | undefined): Promise<ICompanyFeedBackSchema[]>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class CompanyFeedBackRepository implements ICompanyFeedBackRepository {

    /**
     * Constructor for JobRepository.
     * @param helper - An instance of the Helper class.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Retrieves all jobs from the database.
     * @param session - The database session.
     * @returns A promise that resolves to an array of job data.
     */
    public async gets(companyId: string | undefined): Promise<ICompanyFeedBackSchema[]> {

        return await CompanyFeedBackSchema.find({ companyId }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ICompanyFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async saveMany(input: ICompanyFeedBackSchema[], session: ClientSession | undefined): Promise<ICompanyFeedBackSchema[]> {

        return await CompanyFeedBackSchema.create(input, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ICompanyFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
