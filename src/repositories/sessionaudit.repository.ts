import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import SessionAuditSchema, { ISessionAuditSchema } from "../dao/sessionaudit";
import DbSession from "../db/dbsession";

/**
 * Interface for session audit repository.
 */
export interface ISessionAuditRepository {
    /**
     * Checks if a session audit with the given name exists.
     * @param name - The name of the session audit.
     * @returns A promise that resolves to a boolean indicating whether the session audit exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a session audit.
     * @param input - The session audit schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session audit schema.
     */
    save(input: ISessionAuditSchema, session: ClientSession | undefined): Promise<ISessionAuditSchema>;

    /**
     * Retrieves all session audits.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session audit schemas.
     */
    gets(session: ClientSession | undefined): Promise<ISessionAuditSchema[]>;

    /**
     * Retrieves a session audit by its ID.
     * @param _id - The ID of the session audit.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session audit schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<ISessionAuditSchema>;

    /**
     * Updates a session audit.
     * @param input - The session audit schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: ISessionAuditSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a session audit by its ID.
     * @param _id - The ID of the session audit.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class SessionAuditRepository
 * @implements ISessionAuditRepository
 * @description Repository class for managing session audit data.
 */
@injectable()
export class SessionAuditRepository implements ISessionAuditRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a session audit with the given name exists.
     * @param name - The name of the session audit.
     * @returns A promise that resolves to a boolean indicating whether the session audit exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await SessionAuditSchema.find({ name }, { _id: 1 })
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
     * Saves a session audit.
     * @param input - The session audit schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session audit schema.
     */
    public async save(input: ISessionAuditSchema, session: ClientSession | undefined): Promise<ISessionAuditSchema> {

        return await SessionAuditSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionAuditSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all session audits.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session audit schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<ISessionAuditSchema[]> {

        return await SessionAuditSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ISessionAuditSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a session audit by its ID.
     * @param _id - The ID of the session audit.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session audit schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<ISessionAuditSchema> {

        return await SessionAuditSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionAuditSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a session audit.
     * @param input - The session audit schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: ISessionAuditSchema, session: ClientSession | undefined): Promise<void> {

        await SessionAuditSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a session audit by its ID.
     * @param _id - The ID of the session audit.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: ISessionAuditSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await SessionAuditSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
