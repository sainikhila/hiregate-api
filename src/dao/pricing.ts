import mongoose, { Document, Schema } from "mongoose";


export interface IDetailsSchema extends Document {
    label: string;
    items: string[];
}

export const DetailsSchema: Schema = new Schema({
    label: { type: String, default: null },
    items: { type: [String], default: [] }
}, {
    _id: false
});

export interface IPricingSchema extends Document {
    name: string;
    price: Number;
    plantype: string;
    plan: string;
    details: [IDetailsSchema];
}

export const PricingSchema: Schema = new Schema({
    name: { type: String, default: null },
    price: { type: Number, default: 0 },
    plantype: { type: String, default: null },
    plan: { type: String, default: null },
    details: [DetailsSchema]
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IPricingSchema>("PricingPlan", PricingSchema);

export default schemaModal;