import { injectable, inject } from "inversify";
import { Error } from "mongoose";
import Helper from "../utils/helper";
import DefaultFeedBackSchema, { IDefaultFeedBackSchema } from "../dao/defaultfeedback";

/**
 * Interface representing a repository for managing job data.
 */
export interface IDefaultFeedBackRepository {

    gets(): Promise<IDefaultFeedBackSchema[]>;

    save(defaultFeedBacks: IDefaultFeedBackSchema[]): Promise<any>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class DefaultFeedBackRepository implements IDefaultFeedBackRepository {

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
    public async gets(): Promise<IDefaultFeedBackSchema[]> {

        return await DefaultFeedBackSchema.find({}, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IDefaultFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async save(defaultFeedBacks: IDefaultFeedBackSchema[]): Promise<any> {

        return await DefaultFeedBackSchema.create(defaultFeedBacks)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, {});
                return results;
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
