import mongoose, { Document, Schema } from "mongoose";

export interface IFeedBackSchema extends Document {
    title: string;
    description: string;
    companyId: string;
}

export const FeedBackSchema: Schema = new Schema({
    title: { type: String, default: null },
    description: { type: String, default: null },
    companyId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IFeedBackSchema>("FeedBack", FeedBackSchema);

export default schemaModal;