import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import JobFeedBackSchema, { IJobFeedBackSchema } from "../dao/jobfeedback";

/**
 * Interface representing a repository for managing job data.
 */
export interface IJobFeedBackRepository {
    gets(jobId: string | undefined): Promise<IJobFeedBackSchema[]>;
    saveMany(input: IJobFeedBackSchema[], session: ClientSession | undefined): Promise<IJobFeedBackSchema[]>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class JobFeedBackRepository implements IJobFeedBackRepository {

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
    public async gets(jobId: string | undefined): Promise<IJobFeedBackSchema[]> {

        return await JobFeedBackSchema.find({ jobId }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as any[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async saveMany(input: IJobFeedBackSchema[], session: ClientSession | undefined): Promise<IJobFeedBackSchema[]> {

        return await JobFeedBackSchema.create(input, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobFeedBackSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
