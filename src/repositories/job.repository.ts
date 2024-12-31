import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import JobSchema, { IJobSchema } from "../dao/job";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for managing job data.
 */
export interface IJobRepository {

    /**
     * Checks if a job with the given name exists.
     * @param name - The name of the job to check.
     * @returns A promise that resolves to a boolean indicating whether the job exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a job to the repository.
     * @param job - The job schema to save.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to the saved job schema.
     */
    save(input: IJobSchema, session: ClientSession | undefined): Promise<IJobSchema>;

    /**
     * Retrieves all jobs from the repository.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to an array of job schemas.
     */
    gets(): Promise<IJobSchema[]>;

    /**
     * Retrieves a job by its ID.
     * @param _id - The ID of the job to retrieve.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to the job schema.
     */
    get(_id: string): Promise<IJobSchema>;

    /**
     * Updates a job in the repository.
     * @param job - The job schema to update.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: IJobSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a job from the repository by its ID.
     * @param _id - The ID of the job to delete.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;

    getAllJobHeaders(companyId: string): Promise<IJobSchema[]>;

    getJobsByCompany(companyId: string | unknown, fields: {}): Promise<IJobSchema[]>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class JobRepository implements IJobRepository {

    /**
     * Constructor for JobRepository.
     * @param helper - An instance of the Helper class.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a job with the given name exists in the database.
     * @param name - The name of the job to check.
     * @returns A promise that resolves to a boolean indicating whether the job exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await JobSchema.find({ name }, { _id: 1 })
            .then((data: any[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    /**
     * Saves a new job to the database.
     * @param input - The job data to save.
     * @param session - The database session.
     * @returns A promise that resolves to the saved job data.
     */
    public async save(input: IJobSchema, session: ClientSession | undefined): Promise<IJobSchema> {

        return await JobSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IJobSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all jobs from the database.
     * @param session - The database session.
     * @returns A promise that resolves to an array of job data.
     */
    public async gets(): Promise<IJobSchema[]> {

        return await JobSchema.find({}, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Retrieves all jobs from the database.
     * @param session - The database session.
     * @returns A promise that resolves to an array of job data.
     */
    public async getJobsByCompany(companyId: string | unknown, fields: {}): Promise<IJobSchema[]> {

        const rFields = fields || { __v: 0 };

        return await JobSchema.find({ companyId }, { ...rFields })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Retrieves a job by its ID from the database.
     * @param _id - The ID of the job to retrieve.
     * @param session - The database session.
     * @returns A promise that resolves to the job data.
     */
    public async get(_id: string): Promise<IJobSchema> {

        return await JobSchema.find({ _id }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IJobSchema;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Updates an existing job in the database.
     * @param input - The job data to update.
     * @param session - The database session.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: IJobSchema, session: ClientSession | undefined): Promise<void> {

        await JobSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a job by its ID from the database.
     * @param _id - The ID of the job to delete.
     * @param session - The database session.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: IJobSchema = await this.get(_id);
        input.recordStatus = 3;

        await JobSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    public async getAllJobHeaders(companyId: string): Promise<IJobSchema[]> {

        let $match = { companyId: this.helper.ObjectId(companyId) };

        let $piepline = [
            { $match },
            {
                $lookup: {
                    from: 'users',
                    localField: 'createdBy',
                    foreignField: '_id',
                    as: 'created'
                }
            },
            { $unwind: { path: "$created", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'publishedBy',
                    foreignField: '_id',
                    as: 'published'
                }
            },
            { $unwind: { path: "$published", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'closedBy',
                    foreignField: '_id',
                    as: 'closed'
                }
            },
            { $unwind: { path: "$closed", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    jobId: 1,
                    publishedOn: 1,
                    isPublished: 1,
                    isClosed: 1,
                    closedOn: 1,
                    publishedById: "$publishedBy",
                    publishedBy: "$published.name",
                    closedById: "$closedBy",
                    closedBy: "$closed.name",
                    createdById: "$createdBy",
                    createdBy: "$created.name",
                    recordStatus: 1
                }
            }
        ];

        return await JobSchema.aggregate($piepline)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });
    }
}
