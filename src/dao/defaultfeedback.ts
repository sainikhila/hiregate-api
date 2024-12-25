import mongoose, { Document, Schema } from "mongoose";

export interface IDefaultFeedBackSchema extends Document {
    title: string;
    description: string;
}

export const DefaultFeedBackSchema: Schema = new Schema({
    title: { type: String, default: null },
    description: { type: String, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IDefaultFeedBackSchema>("DefaultFeedBack", DefaultFeedBackSchema);

export default schemaModal;