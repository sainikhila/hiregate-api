import mongoose, { Document, Schema } from "mongoose";


export interface INoteSchema extends Document {
    description: string;
    noteTypeId: number;
    mapId: mongoose.Types.ObjectId;
    recordStatus: number;
}

export const NoteSchema: Schema = new Schema({
    description: { type: String },
    noteTypeId: { type: Number, default: 0 },
    mapId: { type: Schema.Types.ObjectId, required: true },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<INoteSchema>("Note", NoteSchema);

export default schemaModal;