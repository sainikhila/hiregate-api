import mongoose, { Document, Schema } from "mongoose";

export interface IUserRatingSchema extends Document {
    userId: mongoose.Types.ObjectId;
    ratingId: mongoose.Types.ObjectId;
    rating: number;
    recordStatus: number;
}

export const UserRatingSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    ratingId: { type: Schema.Types.ObjectId, ref: 'RatingParameter' },
    rating: { type: Number, default: 0 },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IUserRatingSchema>("UserRating", UserRatingSchema);

export default schemaModal;