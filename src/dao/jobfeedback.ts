import mongoose, { Document, Schema } from "mongoose";

export interface IJobFeedBackSchema extends Document {
    title: string;
    description: string;
    typeId: number;
    jobId: string | unknown;
    mapId: string | unknown;
}

export const JobFeedBackSchema: Schema = new Schema({
    title: { type: String, default: null },
    description: { type: String, default: null },
    typeId: { type: Number, default: 2 },
    jobId: { type: Schema.Types.ObjectId, default: null },
    mapId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IJobFeedBackSchema>("JobFeedBack", JobFeedBackSchema);

export default schemaModal;