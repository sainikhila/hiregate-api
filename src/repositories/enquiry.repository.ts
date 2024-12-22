import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import EnquirySchema, { IEnquirySchema } from "../dao/enquiry";
import DbSession from "../db/dbsession";

export interface IEnquiryRepository {
    save(input: IEnquirySchema, session: ClientSession | undefined): Promise<IEnquirySchema>;
}

/**
 * @class EnquiryRepository
 * @implements IEnquiryRepository
 * @description Repository class for managing enquiry data.
 */
@injectable()
export class EnquiryRepository implements IEnquiryRepository {

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
    public async save(input: IEnquirySchema, session: ClientSession | undefined): Promise<IEnquirySchema> {

        return await EnquirySchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IEnquirySchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
