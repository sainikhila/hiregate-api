import mongoose, { Document, Schema } from "mongoose";

export interface IJobAssigneeSchema extends Document {
    jobId: string | unknown;
    assigneeId: string | unknown;
    recordStatus: number;
}

export const JobAssigneeSchema: Schema = new Schema({
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', default: null },
    assigneeId: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IJobAssigneeSchema>("JobAssignee", JobAssigneeSchema);

export default schemaModal;