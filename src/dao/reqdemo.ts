
import mongoose, { Document, Schema } from "mongoose";

export interface IReqDemoSchema extends Document {
    name: string;
    email: string;
    phone: string;
    company: string;
    city: string;
    country: string;
}

export const ReqDemoSchema: Schema = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    phone: { type: String, default: null },
    company: { type: String, default: null },
    city: { type: String, default: null },
    country: { type: String, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IReqDemoSchema>("RequestDemo", ReqDemoSchema);

export default schemaModal;