import mongoose, { Document, Schema } from "mongoose";

export interface IShareSchema extends Document {
    name: string;
    email: string;
    approved: boolean;
    sessionId: string;
    recordStatus: number;
}

export const ShareSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    approved: { type: Boolean, default: false },
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IShareSchema>("SharedSession", ShareSchema);

export default schemaModal;