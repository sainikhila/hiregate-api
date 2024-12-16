import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import UserRatingSchema, { IUserRatingSchema } from "../dao/userrating";
import DbSession from "../db/dbsession";

export interface IUserRatingRepository {
    isExist(name: string): Promise<boolean>;
    save(input: IUserRatingSchema, session: ClientSession | undefined): Promise<IUserRatingSchema>;
    gets(session: ClientSession | undefined): Promise<IUserRatingSchema[]>;
    get(_id: string, session: ClientSession | undefined): Promise<IUserRatingSchema>;
    update(input: IUserRatingSchema, session: ClientSession | undefined): Promise<void>;
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class UserRatingRepository
 * @implements IUserRatingRepository
 * @description Repository class for managing user rating data.
 */
@injectable()
export class UserRatingRepository implements IUserRatingRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a user rating with the given name exists.
     * @param name - The name of the user rating to check.
     * @returns A promise that resolves to a boolean indicating whether the user rating exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await UserRatingSchema.find({ name }, { _id: 1 })
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
     * Saves a user rating.
     * @param input - The user rating schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved user rating schema.
     */
    public async save(input: IUserRatingSchema, session: ClientSession | undefined): Promise<IUserRatingSchema> {

        return await UserRatingSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserRatingSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all user ratings.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of user rating schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<IUserRatingSchema[]> {

        return await UserRatingSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IUserRatingSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a user rating by its ID.
     * @param _id - The ID of the user rating to retrieve.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the user rating schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<IUserRatingSchema> {

        return await UserRatingSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserRatingSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a user rating.
     * @param input - The user rating schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: IUserRatingSchema, session: ClientSession | undefined): Promise<void> {

        await UserRatingSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a user rating by its ID.
     * @param _id - The ID of the user rating to delete.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: IUserRatingSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await UserRatingSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
