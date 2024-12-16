import mongoose, { Document, Schema } from "mongoose";

export interface ISessionSchema extends Document {
    candidateId: mongoose.Types.ObjectId;
    interviewerId: mongoose.Types.ObjectId;
    jobId: mongoose.Types.ObjectId;
    scheduledAt: Date;
    scheduledBy: mongoose.Types.ObjectId;
    sessionLink?: string;
    recordStatus: number;
}

export const SessionSchema: Schema = new Schema({
    candidateId: { type: Schema.Types.ObjectId, ref: 'User' },
    interviewerId: { type: Schema.Types.ObjectId, ref: 'User' },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' },
    scheduledAt: { type: Date, required: true },
    scheduledBy: { type: Schema.Types.ObjectId, ref: 'User' },
    sessionLink: { type: String, default: null },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ISessionSchema>("Session", SessionSchema);

export default schemaModal;