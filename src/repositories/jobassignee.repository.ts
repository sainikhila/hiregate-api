import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import DbSession from "../db/dbsession";
import JobAssigneeSchema, { IJobAssigneeSchema } from "../dto/jobassignee";

/**
 * Interface representing a repository for managing job data.
 */
export interface IJobAssigneeRepository {

    /**
     * Saves a job to the repository.
     * @param job - The job schema to save.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to the saved job schema.
     */
    save(input: IJobAssigneeSchema, session: ClientSession | undefined): Promise<IJobAssigneeSchema>;

    saveMany(input: IJobAssigneeSchema[], session: ClientSession | undefined): Promise<IJobAssigneeSchema[]>;

    /**
     * Retrieves all jobs from the repository.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to an array of job schemas.
     */
    gets(session: ClientSession | undefined): Promise<IJobAssigneeSchema[]>;

    /**
     * Retrieves a job by its ID.
     * @param _id - The ID of the job to retrieve.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to the job schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<IJobAssigneeSchema>;

    /**
     * Updates a job in the repository.
     * @param job - The job schema to update.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: IJobAssigneeSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a job from the repository by its ID.
     * @param _id - The ID of the job to delete.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class JobRepository
 * @implements IJobRepository
 * @description Repository class for managing job data.
 */
@injectable()
export class JobAssigneeRepository implements IJobAssigneeRepository {

    /**
     * Constructor for JobRepository.
     * @param helper - An instance of the Helper class.
     */
    constructor(@inject(Helper) private helper: Helper) { }


    /**
     * Saves a new job to the database.
     * @param input - The job data to save.
     * @param session - The database session.
     * @returns A promise that resolves to the saved job data.
     */
    public async save(input: IJobAssigneeSchema, session: ClientSession | undefined): Promise<IJobAssigneeSchema> {

        return await JobAssigneeSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IJobAssigneeSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    public async saveMany(input: IJobAssigneeSchema[], session: ClientSession | undefined): Promise<IJobAssigneeSchema[]> {

        return await JobAssigneeSchema.create(input, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobAssigneeSchema[];
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
    public async gets(session: ClientSession | undefined): Promise<IJobAssigneeSchema[]> {

        return await JobAssigneeSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IJobAssigneeSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a job by its ID from the database.
     * @param _id - The ID of the job to retrieve.
     * @param session - The database session.
     * @returns A promise that resolves to the job data.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<IJobAssigneeSchema> {

        return await JobAssigneeSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IJobAssigneeSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates an existing job in the database.
     * @param input - The job data to update.
     * @param session - The database session.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: IJobAssigneeSchema, session: ClientSession | undefined): Promise<void> {

        await JobAssigneeSchema.updateOne([input], { session })
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

        let input: IJobAssigneeSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await JobAssigneeSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
