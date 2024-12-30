import mongoose, { Document, Schema } from "mongoose";

export interface IJobSchema extends Document {
    jobId: string;
    title: string;
    description: string;
    responsibilities?: string;
    qualification?: string;
    skills?: string;
    country?: string;
    locations?: string;
    maxSalary?: number;
    minSalary?: number;
    maxExperience?: number;
    minExperience?: number;
    contactName?: string;
    contactPhone?: string;
    contactEmail?: string;
    isPublished?: boolean;
    publishedOn?: Date;
    isClosed?: boolean;
    closedOn?: Date;
    startAt?: Date;
    endAt?: Date;
    publishedBy?: string;
    closedBy?: string;
    createdBy: string;
    companyId: string;
    recordStatus: number;
}

export const JobSchema: Schema = new Schema({
    jobId: { type: String, required: true },
    title: { type: String, required: true },
    qualification: { type: String, default: null },
    description: { type: String, required: true },
    skills: { type: String, default: null },
    responsibilities: { type: String, default: null },
    country: { type: String, default: null },
    locations: { type: String, default: null },
    maxSalary: { type: Number, default: 0 },
    minSalary: { type: Number, default: 0 },
    maxExperience: { type: Number, default: 0 },
    minExperience: { type: Number, default: 0 },
    contactName: { type: String, default: null },
    contactPhone: { type: String, default: null },
    contactEmail: { type: String, default: null },
    isPublished: { type: Boolean, default: false },
    publishedOn: { type: Date, default: null },
    isClosed: { type: Boolean, default: false },
    closedOn: { type: Date, default: null },
    startAt: { type: Date, default: null },
    endAt: { type: Date, default: null },
    publishedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    closedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    companyId: { type: Schema.Types.ObjectId, ref: 'Company', default: null },
    recordStatus: { type: Number, default: 1 }
}, {
    timestamps: true
});

const schemaModal = mongoose.model<IJobSchema>("Job", JobSchema);

export default schemaModal;