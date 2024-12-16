import mongoose, { Document, Schema } from "mongoose";

export interface ISessionAttendeeSchema extends Document {
    sessionId: mongoose.Types.ObjectId;
    mapId: mongoose.Types.ObjectId;
    recordStatus: number;
}

export const SessionAttendeeSchema: Schema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    mapId: { type: Schema.Types.ObjectId, ref: 'User' },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ISessionAttendeeSchema>("SessionAttendee", SessionAttendeeSchema);

export default schemaModal;