import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import DbSession from "../db/dbsession";
import AddressSchema, { IAddressSchema } from "../dao/address";

export interface IAddressRepository {
    save(input: IAddressSchema, session: ClientSession | undefined): Promise<IAddressSchema>;
}

@injectable()
export class AddressRepository implements IAddressRepository {

    constructor(@inject(Helper) private helper: Helper) { }

    public async save(input: IAddressSchema, session: ClientSession | undefined): Promise<IAddressSchema> {

        return await AddressSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IAddressSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }
}
