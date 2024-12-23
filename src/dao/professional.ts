import mongoose, { Document, Schema } from "mongoose";

export interface IProfessionalSchema extends Document {
    month: number;
    year: number;
    ctc: string | null;
    expctc: string | null;
    resume: string | null;
    linkedIn: string | null;
    userId: mongoose.Types.ObjectId;
    recordStatus: number;
}

export const ProfessionalSchema: Schema = new Schema({
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    ctc: { type: String, default: null },
    expctc: { type: String, default: null },
    resume: { type: String, default: null },
    linkedIn: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IProfessionalSchema>("Professional", ProfessionalSchema);

export default schemaModal;
