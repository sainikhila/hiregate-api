import mongoose, { Document, Schema } from "mongoose";

export interface ISkillSchema extends Document {
    name: string | null;
    month: number;
    year: number;
    userId: mongoose.Types.ObjectId;
    recordStatus: number;
}

export const SkillSchema: Schema = new Schema({
    name: { type: String, default: null },
    month: { type: Number, default: 0 },
    year: { type: Number, default: 0 },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ISkillSchema>("Skill", SkillSchema);

export default schemaModal;