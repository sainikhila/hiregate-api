import { injectable, inject } from "inversify";
import { Error } from "mongoose";
import Helper from "../utils/helper";
import PricingSchema, { IPricingSchema } from '../dao/pricing';

export interface IPricingRepository {
    get(): Promise<IPricingSchema[]>;
}

/**
 * @class EnquiryRepository
 * @implements IEnquiryRepository
 * @description Repository class for managing enquiry data.
 */
@injectable()
export class PricingRepository implements IPricingRepository {

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
    public async get(): Promise<IPricingSchema[]> {

        return await PricingSchema.find({}, { __v: 0, "details_id": 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IPricingSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }
}
