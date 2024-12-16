import mongoose, { Document, Schema } from "mongoose";

export interface IPreRatingParameterSchema extends Document {
    name: string;
    question: string;
    recordStatus: number;
}

export const PreRatingParameterSchema: Schema = new Schema({
    name: { type: String, required: true },
    question: { type: String, required: true },
    recordStatus: { type: Number, required: true }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IPreRatingParameterSchema>("PreRatingParameter", PreRatingParameterSchema);

export default schemaModal;