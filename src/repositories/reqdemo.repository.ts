import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import ReqDemoSchema, { IReqDemoSchema } from "../dao/reqdemo";
import DbSession from "../db/dbsession";

export interface IReqDemoRepository {
    save(input: IReqDemoSchema, session: ClientSession | undefined): Promise<IReqDemoSchema>;
}

/**
 * @class ReqDemoRepository
 * @implements IReqDemoRepository
 * @description Repository class for managing enquiry data.
 */
@injectable()
export class ReqDemoRepository implements IReqDemoRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Saves a enquiry to the repository.
     * @param input - The enquiry schema to save.
     * @param session - The client session for the operation.
     * @returns A promise that resolves to the saved enquiry schema.
     */
    public async save(input: IReqDemoSchema, session: ClientSession | undefined): Promise<IReqDemoSchema> {

        return await ReqDemoSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IReqDemoSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
