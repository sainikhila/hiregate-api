import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import NoteSchema, { INoteSchema } from "../dao/note";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for managing notes.
 */
export interface INoteRepository {
    /**
     * Checks if a note with the given name exists.
     * @param name - The name of the note.
     * @returns A promise that resolves to a boolean indicating whether the note exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a note to the repository.
     * @param input - The note schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved note schema.
     */
    save(input: INoteSchema, session: ClientSession | undefined): Promise<INoteSchema>;

    /**
     * Retrieves all notes from the repository.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of note schemas.
     */
    gets(session: ClientSession | undefined): Promise<INoteSchema[]>;

    /**
     * Retrieves a note by its ID.
     * @param _id - The ID of the note.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the note schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<INoteSchema>;

    /**
     * Updates a note in the repository.
     * @param input - The note schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: INoteSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a note by its ID.
     * @param _id - The ID of the note.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class NoteRepository
 * @implements INoteRepository
 * @description Repository class for managing Note entities.
 */
@injectable()
export class NoteRepository implements INoteRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * @method isExist
     * @description Checks if a note with the given name exists.
     * @param {string} name - The name of the note to check.
     * @returns {Promise<boolean>} - Returns true if the note exists, otherwise false.
     */
    public async isExist(name: string): Promise<boolean> {

        return await NoteSchema.find({ name }, { _id: 1 })
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
     * @method save
     * @description Saves a new note to the database.
     * @param {INoteSchema} input - The note to save.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<INoteSchema>} - Returns the saved note.
     */
    public async save(input: INoteSchema, session: ClientSession | undefined): Promise<INoteSchema> {

        return await NoteSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as INoteSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method gets
     * @description Retrieves all notes from the database.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<INoteSchema[]>} - Returns an array of notes.
     */
    public async gets(session: ClientSession | undefined): Promise<INoteSchema[]> {

        return await NoteSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as INoteSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method get
     * @description Retrieves a note by its ID.
     * @param {string} _id - The ID of the note to retrieve.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<INoteSchema>} - Returns the retrieved note.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<INoteSchema> {

        return await NoteSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as INoteSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method update
     * @description Updates an existing note in the database.
     * @param {INoteSchema} input - The note to update.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - Returns nothing.
     */
    public async update(input: INoteSchema, session: ClientSession | undefined): Promise<void> {

        await NoteSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method delete
     * @description Marks a note as deleted by setting its recordStatus to 3.
     * @param {string} _id - The ID of the note to delete.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - Returns nothing.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: INoteSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await NoteSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}

