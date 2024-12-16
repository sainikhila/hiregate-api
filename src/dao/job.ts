import mongoose, { Document, Schema } from "mongoose";

export interface IJobSchema extends Document {
    title: string;
    qualification?: string;
    description: string;
    skills?: string;
    responsibilities?: string;
    locations?: string;
    maxSalary?: number;
    minSalary?: number;
    maxExperience?: number;
    minExperience?: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    published?: boolean;
    startAt: { type: Date, default: null };
    endAt: { type: Date, default: null };
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' };
    companyId: mongoose.Types.ObjectId;
    recordStatus?: number;
}

export const JobSchema: Schema = new Schema({
    title: { type: String, required: true },
    qualification: { type: String, default: null },
    description: { type: String, required: true },
    skills: { type: String, default: null },
    responsibilities: { type: String, default: null },
    locations: { type: String, default: null },
    maxSalary: { type: Number, default: 0 },
    minSalary: { type: Number, default: 0 },
    maxExperience: { type: Number, default: 0 },
    minExperience: { type: Number, default: 0 },
    contactName: { type: String, default: null },
    contactPhone: { type: String, default: null },
    contactEmail: { type: String, default: null },
    published: { type: Boolean, default: false },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company' },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IJobSchema>("Job", JobSchema);

export default schemaModal;