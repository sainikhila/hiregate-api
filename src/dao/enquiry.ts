import mongoose, { Document, Schema } from "mongoose";

export interface IEnquirySchema extends Document {
    name: string;
    email: string;
    mobileNumber: string;
    message: string;
    subject: string;
}

export const EnquirySchema: Schema = new Schema({
    name: { type: String, default: null },
    email: { type: String, default: null },
    mobileNumber: { type: String, default: null },
    message: { type: String, default: null },
    subject: { type: String, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IEnquirySchema>("Enquiry", EnquirySchema);

export default schemaModal;