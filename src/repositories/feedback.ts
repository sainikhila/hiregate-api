import { injectable, inject } from "inversify";
import { Error } from "mongoose";
import Helper from "../utils/helper";
import FeedBackSchema, { IFeedBackSchema } from "../dao/feedback";

/**
 * Interface representing a repository for managing job data.
 */
export interface IFeedBackRepository {
    gets(companyId: string | undefined): Promise<IFeedBackSchema[]>;
    count(companyId: string | undefined): Promise<number>;
    save(input: IFeedBackSchema[]): Promise<IFeedBackSchema[]>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class FeedBackRepository implements IFeedBackRepository {

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
    public async gets(companyId: string | undefined): Promise<IFeedBackSchema[]> {

        return await FeedBackSchema.find({ companyId }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async count(companyId: string | undefined): Promise<number> {

        return await FeedBackSchema.countDocuments({ companyId })
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async save(input: IFeedBackSchema[]): Promise<IFeedBackSchema[]> {

        return await FeedBackSchema.create(input)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
