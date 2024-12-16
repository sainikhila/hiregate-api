import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import SkillSchema, { ISkillSchema } from "../dao/skill";
import DbSession from "../db/dbsession";

export interface ISkillRepository {
    isExist(name: string): Promise<boolean>;
    save(input: ISkillSchema, session: ClientSession | undefined): Promise<ISkillSchema>;
    gets(session: ClientSession | undefined): Promise<ISkillSchema[]>;
    get(_id: string, session: ClientSession | undefined): Promise<ISkillSchema>;
    update(input: ISkillSchema, session: ClientSession | undefined): Promise<void>;
    delete(_id: string, session: ClientSession | undefined): Promise<void>;
}

/**
 * @class SkillRepository
 * @implements ISkillRepository
 * @description Repository class for managing skill data.
 */
@injectable()
export class SkillRepository implements ISkillRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a skill with the given name exists.
     * @param name - The name of the skill to check.
     * @returns A promise that resolves to a boolean indicating whether the skill exists.
     */
    public async isExist(name: string): Promise<boolean> {

        return await SkillSchema.find({ name }, { _id: 1 })
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
     * Saves a skill to the repository.
     * @param input - The skill schema to save.
     * @param session - The client session for the operation.
     * @returns A promise that resolves to the saved skill schema.
     */
    public async save(input: ISkillSchema, session: ClientSession | undefined): Promise<ISkillSchema> {

        return await SkillSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISkillSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all skills from the repository.
     * @param session - The client session for the operation.
     * @returns A promise that resolves to an array of skill schemas.
     */
    public async gets(session: ClientSession | undefined): Promise<ISkillSchema[]> {

        return await SkillSchema.find({}, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ISkillSchema[];
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves a skill by its ID.
     * @param _id - The ID of the skill to retrieve.
     * @param session - The client session for the operation.
     * @returns A promise that resolves to the skill schema.
     */
    public async get(_id: string, session: ClientSession | undefined): Promise<ISkillSchema> {

        return await SkillSchema.find({ _id }, { __v: 0 }, { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ISkillSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Updates a skill in the repository.
     * @param input - The skill schema to update.
     * @param session - The client session for the operation.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: ISkillSchema, session: ClientSession | undefined): Promise<void> {

        await SkillSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a skill by its ID.
     * @param _id - The ID of the skill to delete.
     * @param session - The client session for the operation.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string, session: ClientSession | undefined): Promise<void> {

        let input: ISkillSchema = await this.get(_id, session);
        input.recordStatus = 3;

        await SkillSchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
