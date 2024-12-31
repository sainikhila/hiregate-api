import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import CounterSchema from "../dao/counter";

export interface ICounterRepository {
    getSequenceId(input: string): Promise<string>;
}

@injectable()
export class CounterRepository implements ICounterRepository {

    constructor(@inject(Helper) private helper: Helper) { }

    public async getSequenceId(input: string): Promise<string> {

        return await CounterSchema.findOneAndUpdate(
            { _id: input },
            { $inc: { sequence_value: 1 } },
            { returnDocument: 'after', upsert: true }
        ).then((data: any) => {
            let results = this.helper.GetItemFromArray(data, 0, { sequence_value: null });
            return results.sequence_value as string;
        }).catch((error: Error) => {
            throw error;
        });

    }
}
