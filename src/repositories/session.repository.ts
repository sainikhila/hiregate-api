import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import SessionSchema, { ISessionSchema } from "../dao/session";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for managing sessions.
 */
export interface ISessionRepository {
    /**
     * Checks if a session with the given name exists.
     * @param name - The name of the session to check.
     * @returns A promise that resolves to a boolean indicating whether the session exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a session.
     * @param input - The session schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session schema.
     */
    save(input: ISessionSchema, session: ClientSession | undefined): Promise<ISessionSchema>;

    /**
     * Retrieves all sessions.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session schemas.
     */
    gets(session: ClientSession | undefined): Promise<ISessionSchema[]>;

    /**
     * Retrieves a session by its ID.
     * @param _id - The ID of the session to retrieve.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<ISessionSchema>;

    /**
     * Updates a session.
     * @param input - The session schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: ISessionSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a session by its ID.
     * @param _id - The ID of the session to delete.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class SessionRepository
 * @implements {ISessionRepository}
 * @description Repository class for managing session-related database operations.
 */
@injectable()
export class SessionRepository implements ISessionRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a session with the given name exists.
     * @param name - The name of the session to check.
     * @returns A promise that resolves to a boolean indicating whether the session exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await SessionSchema.find({ name }, { _id: 1 })
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
     * Saves a session.
     * @param input - The session schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session schema.
     */
    public async save(input: ISessionSchema, session: ClientSession | undefined): Promise<ISessionSchema> {

        return await SessionSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all sessions.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<ISessionSchema[]> {

        return await SessionSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ISessionSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a session by its ID.
     * @param _id - The ID of the session to retrieve.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<ISessionSchema> {

        return await SessionSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a session.
     * @param input - The session schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: ISessionSchema, session: ClientSession | undefined): Promise<void> {

        await SessionSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a session by its ID.
     * @param _id - The ID of the session to delete.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: ISessionSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await SessionSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
