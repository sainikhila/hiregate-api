import mongoose, { Document, Schema } from "mongoose";

export interface IRatingParameterSchema extends Document {
    name: string;
    question: string;
    recordStatus: number;
    jobId: string;
}

export const RatingParameterSchema: Schema = new Schema({
    name: { type: String, required: true },
    question: { type: String, required: true },
    recordStatus: { type: Number, required: true },
    jobId: { type: Schema.Types.ObjectId, ref: 'Job' }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IRatingParameterSchema>("RatingParameter", RatingParameterSchema);

export default schemaModal;