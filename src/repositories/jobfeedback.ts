import { injectable, inject } from "inversify";
import { Error } from "mongoose";
import Helper from "../utils/helper";
import FeedBackSchema, { IFeedBackSchema } from "../dao/feedback";
import JobFeedBackSchema from "../dao/jobfeedback";

/**
 * Interface representing a repository for managing job data.
 */
export interface IJobFeedBackRepository {
    get(companyId: string | undefined, jobId: string | undefined): Promise<any>;
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
    public async get(companyId: string | undefined, jobId: string | undefined): Promise<any> {

        let $pipeline = [
            {
                $match: {
                    companyId: this.helper.ObjectId(companyId),
                    jobId: this.helper.ObjectId(jobId)
                }
            },
            {
                $lookup: {
                    from: "feedbacks",
                    localField: "companyId",
                    foreignField: "_id",
                    as: "feedback"
                }
            },
            { $unwind: "$feedback" },
            {
                $project: {
                    "id": "$_id",
                    _id: 0,
                    title: "$feedback.title",
                    description: "$feedback.description",
                    companyId: 1,
                    jobId: 1
                }
            }
        ];

        return await JobFeedBackSchema.find({ companyId }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as any[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
