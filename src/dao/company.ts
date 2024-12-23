import mongoose, { Document, Schema } from "mongoose";

export interface ICompanySchema extends Document {
    name: string;
    cinllp: string;
    gstno: string;
    city: string;
    state: string;
    country: string;
    address: string;
    zipcode: string;
    website: string;
    recordStatus: number;
};

export const CompanySchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    cinllp: { type: String, required: true, unique: true },
    gstno: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    zipcode: { type: String, required: true },
    website: { type: String, default: null },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ICompanySchema>("Company", CompanySchema);

export default schemaModal;