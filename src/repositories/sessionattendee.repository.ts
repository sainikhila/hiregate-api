import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import SessionAttendeeSchema, { ISessionAttendeeSchema } from "../dao/sessionattendee";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for session attendees.
 */
export interface ISessionAttendeeRepository {
    /**
     * Checks if a session attendee with the given name exists.
     * @param name - The name of the session attendee.
     * @returns A promise that resolves to a boolean indicating whether the session attendee exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a session attendee.
     * @param input - The session attendee schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session attendee schema.
     */
    save(input: ISessionAttendeeSchema, session: ClientSession | undefined): Promise<ISessionAttendeeSchema>;

    /**
     * Retrieves all session attendees.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session attendee schemas.
     */
    gets(session: ClientSession | undefined): Promise<ISessionAttendeeSchema[]>;

    /**
     * Retrieves a session attendee by ID.
     * @param _id - The ID of the session attendee.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session attendee schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<ISessionAttendeeSchema>;

    /**
     * Updates a session attendee.
     * @param input - The session attendee schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: ISessionAttendeeSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a session attendee by ID.
     * @param _id - The ID of the session attendee.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class SessionAttendeeRepository
 * @implements ISessionAttendeeRepository
 * @description Repository class for managing session attendee data.
 */
@injectable()
export class SessionAttendeeRepository implements ISessionAttendeeRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a session attendee with the given name exists.
     * @param name - The name of the session attendee.
     * @returns A promise that resolves to a boolean indicating whether the session attendee exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await SessionAttendeeSchema.find({ name }, { _id: 1 })
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
     * Saves a session attendee.
     * @param input - The session attendee schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved session attendee schema.
     */
    public async save(input: ISessionAttendeeSchema, session: ClientSession | undefined): Promise<ISessionAttendeeSchema> {

        return await SessionAttendeeSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionAttendeeSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all session attendees.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of session attendee schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<ISessionAttendeeSchema[]> {

        return await SessionAttendeeSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ISessionAttendeeSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a session attendee by ID.
     * @param _id - The ID of the session attendee.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the session attendee schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<ISessionAttendeeSchema> {

        return await SessionAttendeeSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISessionAttendeeSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a session attendee.
     * @param input - The session attendee schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: ISessionAttendeeSchema, session: ClientSession | undefined): Promise<void> {

        await SessionAttendeeSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a session attendee by ID.
     * @param _id - The ID of the session attendee.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: ISessionAttendeeSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await SessionAttendeeSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
