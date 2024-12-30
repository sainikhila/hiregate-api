import mongoose, { Document, Schema } from "mongoose";

export interface ICompanyFeedBackSchema extends Document {
    title: string;
    description: string;
    companyId: string;
}

export const CompanyFeedBackSchema: Schema = new Schema({
    title: { type: String, default: null },
    description: { type: String, default: null },
    companyId: { type: Schema.Types.ObjectId, default: null }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<ICompanyFeedBackSchema>("CompanyFeedBack", CompanyFeedBackSchema);

export default schemaModal;