import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import RatingParameterSchema, { IRatingParameterSchema } from "../dao/ratingparams";
import DbSession from "../db/dbsession";

/**
 * Interface for Rating Parameter Repository.
 * Provides methods to interact with the rating parameter data.
 */
export interface IRatingParameterRepository {
    /**
     * Checks if a rating parameter with the given name exists.
     * @param name - The name of the rating parameter.
     * @returns A promise that resolves to a boolean indicating whether the rating parameter exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a rating parameter.
     * @param input - The rating parameter schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved rating parameter schema.
     */
    save(input: IRatingParameterSchema, session: ClientSession | undefined): Promise<IRatingParameterSchema>;

    /**
     * Retrieves all rating parameters.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of rating parameter schemas.
     */
    gets(session: ClientSession | undefined): Promise<IRatingParameterSchema[]>;

    /**
     * Retrieves a rating parameter by its ID.
     * @param _id - The ID of the rating parameter.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the rating parameter schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<IRatingParameterSchema>;

    /**
     * Updates a rating parameter.
     * @param input - The rating parameter schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: IRatingParameterSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a rating parameter by its ID.
     * @param _id - The ID of the rating parameter.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class RatingParameterRepository
 * @implements IRatingParameterRepository
 * @description Repository class for managing RatingParameter entities.
 */
@injectable()
export class RatingParameterRepository implements IRatingParameterRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a RatingParameter with the given name exists.
     * @param {string} name - The name of the RatingParameter.
     * @returns {Promise<boolean>} - A promise that resolves to true if the RatingParameter exists, otherwise false.
     */
    public async isExist(name: string): Promise<boolean> {

        return await RatingParameterSchema.find({ name }, { _id: 1 })
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
     * Saves a new RatingParameter.
     * @param {IRatingParameterSchema} input - The RatingParameter to save.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IRatingParameterSchema>} - A promise that resolves to the saved RatingParameter.
     */
    public async save(input: IRatingParameterSchema, session: ClientSession | undefined): Promise<IRatingParameterSchema> {

        return await RatingParameterSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IRatingParameterSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all RatingParameters.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IRatingParameterSchema[]>} - A promise that resolves to an array of RatingParameters.
     */
    public async gets(session: ClientSession | undefined): Promise<IRatingParameterSchema[]> {

        return await RatingParameterSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IRatingParameterSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a RatingParameter by its ID.
     * @param {string} _id - The ID of the RatingParameter.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IRatingParameterSchema>} - A promise that resolves to the retrieved RatingParameter.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<IRatingParameterSchema> {

        return await RatingParameterSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IRatingParameterSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates an existing RatingParameter.
     * @param {IRatingParameterSchema} input - The RatingParameter to update.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - A promise that resolves when the update is complete.
     */
    public async update(input: IRatingParameterSchema, session: ClientSession | undefined): Promise<void> {

        await RatingParameterSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a RatingParameter by marking its record status as 3.
     * @param {string} _id - The ID of the RatingParameter to delete.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: IRatingParameterSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await RatingParameterSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
