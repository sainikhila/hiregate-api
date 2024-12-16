import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import ShareSchema, { IShareSchema } from "../dao/share";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for managing shares.
 */
export interface IShareRepository {
    /**
     * Checks if a share with the given name exists.
     * @param name - The name of the share to check.
     * @returns A promise that resolves to a boolean indicating whether the share exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a share to the repository.
     * @param input - The share schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved share schema.
     */
    save(input: IShareSchema, session: ClientSession | undefined): Promise<IShareSchema>;

    /**
     * Retrieves all shares from the repository.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of share schemas.
     */
    gets(session: ClientSession | undefined): Promise<IShareSchema[]>;

    /**
     * Retrieves a share by its ID.
     * @param _id - The ID of the share to retrieve.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the share schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<IShareSchema>;

    /**
     * Updates a share in the repository.
     * @param Share - The share schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(Share: IShareSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a share by its ID.
     * @param _id - The ID of the share to delete.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class ShareRepository
 * @implements IShareRepository
 * @description Repository class for managing share data.
 */
@injectable()
export class ShareRepository implements IShareRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a share with the given name exists.
     * @param name - The name of the share to check.
     * @returns A promise that resolves to a boolean indicating whether the share exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await ShareSchema.find({ name }, { _id: 1 })
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
     * Saves a share to the repository.
     * @param input - The share schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved share schema.
     */
    public async save(input: IShareSchema, session: ClientSession | undefined): Promise<IShareSchema> {

        return await ShareSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IShareSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all shares from the repository.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of share schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<IShareSchema[]> {

        return await ShareSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IShareSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a share by its ID.
     * @param _id - The ID of the share to retrieve.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the share schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<IShareSchema> {

        return await ShareSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IShareSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a share in the repository.
     * @param Share - The share schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: IShareSchema, session: ClientSession | undefined): Promise<void> {

        await ShareSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a share by its ID.
     * @param _id - The ID of the share to delete.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: IShareSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await ShareSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
