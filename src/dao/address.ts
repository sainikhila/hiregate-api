import mongoose, { Document, Schema } from "mongoose";

export interface IAddressSchema extends Document {
    line1: string;
    line2: string;
    line3: string;
    line4: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    mobileNumber: string;
    dailingCode: string;
    landline: string;
    extension: string;
    recordStatus: number;
    mapId: string;
}

export const AddressSchema: Schema = new Schema({
    line1: { type: String, default: null },
    line2: { type: String, default: null },
    line3: { type: String, default: null },
    line4: { type: String, default: null },
    city: { type: String, default: null },
    state: { type: String, default: null },
    country: { type: String, default: null },
    zipCode: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    dailingCode: { type: String, default: null },
    landline: { type: String, default: null },
    extension: { type: String, default: null },
    recordStatus: { type: Number, default: 1 },
    mapId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IAddressSchema>("Address", AddressSchema);

export default schemaModal;