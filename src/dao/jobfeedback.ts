import mongoose, { Document, Schema } from "mongoose";

export interface IJobFeedBackSchema extends Document {
    jobId: string;
    companyId: string;
}

export const JobFeedBackSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, default: null },
    companyId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IJobFeedBackSchema>("JobFeedBack", JobFeedBackSchema);

export default schemaModal;