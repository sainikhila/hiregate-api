import mongoose, { Document, Schema } from "mongoose";

export interface ICounterSchema extends Document {
    _id: string;
    sequence_value: number;
}

export const CounterSchema: Schema = new Schema({
    _id: { type: String, default: null },
    sequence_value: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ICounterSchema>("counter", CounterSchema);

export default schemaModal;