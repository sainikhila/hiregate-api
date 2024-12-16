import mongoose, { Document, Schema } from "mongoose";

export interface IUserSchema extends Document {
    name: string;
    email: string;
    password?: string;
    gender?: string;
    mobileNumber: string;
    location: string;
    landline?: string;
    dailingCode?: string;
    userTypeId: number;
    companyId: mongoose.Types.ObjectId;
    recordStatus: number;
}

export const UserSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, default: null },
    gender: { type: String, default: null },
    mobileNumber: { type: String, required: true },
    location: { type: String, default: null },
    landline: { type: String, default: null },
    dailingCode: { type: String, default: null },
    userTypeId: { type: Number, required: true },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IUserSchema>("User", UserSchema);

export default schemaModal;