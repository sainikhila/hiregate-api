import mongoose, { Document, Schema } from "mongoose";

export interface ISessionRatingSchema extends Document {
    sessionId: mongoose.Types.ObjectId;
    ratingId: mongoose.Types.ObjectId;
    rating: number;
}

export const SessionRatingSchema: Schema = new Schema({
    sessionId: { type: Schema.Types.ObjectId, ref: 'Session' },
    ratingId: { type: Schema.Types.ObjectId, ref: 'RatingParameter' },
    rating: { type: Number, default: 0 },
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ISessionRatingSchema>("SessionRating", SessionRatingSchema);

export default schemaModal;