import mongoose, { Document, Schema } from "mongoose";

export interface ISessionAuditSchema extends Document {
    sessionId: mongoose.Types.ObjectId;
    comments: string;
    recordStatus: number;
}

export const SessionAuditSchema: Schema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    comments: { type: String, required: true },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ISessionAuditSchema>("SessionAudit", SessionAuditSchema);

export default schemaModal;