import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import ProfessionalSchema, { IProfessionalSchema } from "../dao/professional";
import DbSession from "../db/dbsession";

/**
 * Interface representing a repository for managing professionals.
 */
export interface IProfessionalRepository {
    /**
     * Checks if a professional with the given name exists.
     * @param name - The name of the professional.
     * @returns A promise that resolves to a boolean indicating whether the professional exists.
     */
    isExist(name: string): Promise<boolean>;

    /**
     * Saves a professional to the repository.
     * @param input - The professional schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved professional schema.
     */
    save(input: IProfessionalSchema, session: ClientSession | undefined): Promise<IProfessionalSchema>;

    /**
     * Retrieves all professionals from the repository.
     * @param session - The client session, if any.
     * @returns A promise that resolves to an array of professional schemas.
     */
    gets(session: ClientSession | undefined): Promise<IProfessionalSchema[]>;

    /**
     * Retrieves a professional by their ID.
     * @param _id - The ID of the professional.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the professional schema.
     */
    get(_id: string, session: ClientSession | undefined): Promise<IProfessionalSchema>;

    /**
     * Updates a professional in the repository.
     * @param input - The professional schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: IProfessionalSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a professional by their ID.
     * @param _id - The ID of the professional.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class ProfessionalRepository
 * @implements IProfessionalRepository
 * @description Repository class for managing Professional entities.
 */
@injectable()
export class ProfessionalRepository implements IProfessionalRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * @method isExist
     * @description Checks if a Professional entity exists by name.
     * @param {string} name - The name of the Professional.
     * @returns {Promise<boolean>} - Returns true if the Professional exists, otherwise false.
     */
    public async isExist(name: string): Promise<boolean> {

        return await ProfessionalSchema.find({ name }, { _id: 1 })
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
     * @description Saves a new Professional entity.
     * @param {IProfessionalSchema} input - The Professional entity to save.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IProfessionalSchema>} - Returns the saved Professional entity.
     */
    public async save(input: IProfessionalSchema, session: ClientSession | undefined): Promise<IProfessionalSchema> {

        return await ProfessionalSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IProfessionalSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method gets
     * @description Retrieves all Professional entities.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IProfessionalSchema[]>} - Returns an array of Professional entities.
     */
    public async gets(session: ClientSession | undefined): Promise<IProfessionalSchema[]> {

        return await ProfessionalSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IProfessionalSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method get
     * @description Retrieves a Professional entity by ID.
     * @param {string} _id - The ID of the Professional.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<IProfessionalSchema>} - Returns the Professional entity.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<IProfessionalSchema> {

        return await ProfessionalSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IProfessionalSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method update
     * @description Updates an existing Professional entity.
     * @param {IProfessionalSchema} input - The Professional entity to update.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - Returns void.
     */
    public async update(input: IProfessionalSchema, session: ClientSession | undefined): Promise<void> {

        await ProfessionalSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method delete
     * @description Deletes a Professional entity by ID.
     * @param {string} _id - The ID of the Professional.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<void>} - Returns void.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: IProfessionalSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await ProfessionalSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
