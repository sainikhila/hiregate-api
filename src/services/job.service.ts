import { inject, injectable } from "inversify";
import Helper from "../utils/helper";
import { ClientSession } from "mongoose";
import DbSession from "../db/dbsession";

// Repositories
import { IDefaultFeedBackRepository } from "../repositories/defaultfeedback.repository";
import { IDefaultFeedBackSchema } from "../dao/defaultfeedback";
import { ICompanyFeedBackRepository } from "../repositories/companyfeedback.repository";
import { ICompanyFeedBackSchema } from "../dao/companyfeedback";
import { IJobFeedBackRepository } from "../repositories/jobfeedback.repository";
import { ShortUser } from "../dto/user";
import { IUserRepository } from "../repositories/user.repository";
import { IUserSchema } from "../dao/user";
import { Job, JobRatingParam } from "../dto/jobdetails";
import JobSchema, { IJobSchema } from "../dao/job";
import { IJobRepository } from "../repositories/job.repository";
import JobAssigneeSchema, { IJobAssigneeSchema } from "../dto/jobassignee";
import { IJobAssigneeRepository } from "../repositories/jobassignee.repository";
import JobFeedBackSchema, { IJobFeedBackSchema } from "../dao/jobfeedback";

export default interface IJobService {
    getFeedBacks(jobId: string, companyId: string): Promise<JobRatingParam[]>;
    getAllActiveCompanyUser(companyId: string | undefined, userTypeId: number): Promise<ShortUser[]>;
    createNewJob(job: Job): Promise<void>;
    getAllJobHeaders(companyId: string): Promise<Job[]>;
}

@injectable()
export class JobService implements IJobService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IDefaultFeedBackRepository') private defaultFeedBackRepository: IDefaultFeedBackRepository,
        @inject('IJobFeedBackRepository') private jobFeedBackRepository: IJobFeedBackRepository,
        @inject('IUserRepository') private userRepository: IUserRepository,
        @inject('IJobRepository') private jobRepository: IJobRepository,
        @inject('IJobAssigneeRepository') private jobAssigneeRepository: IJobAssigneeRepository,
        @inject('ICompanyFeedBackRepository') private companyFeedBackRepository: ICompanyFeedBackRepository
    ) { }

    public async getFeedBacks(jobId: string, companyId: string): Promise<JobRatingParam[]> {

        // generate feedback parameters for a job
        let jobRatingParams: JobRatingParam[] = [];

        // get job feedback parameters
        let jobFeedBackSchemas: IJobFeedBackSchema[] = [];

        if (!this.helper.IsZeroNullValue(jobId)) {
            jobFeedBackSchemas = await this.jobFeedBackRepository.gets(jobId);
        }

        if (jobFeedBackSchemas && jobFeedBackSchemas.length > 0) {
            jobFeedBackSchemas.forEach((jobFeedBackSchema) => {
                let jobFeedback: JobRatingParam = this.helper.convertTo<IJobFeedBackSchema, JobRatingParam>(jobFeedBackSchema, new JobRatingParam());
                jobRatingParams.push(jobFeedback);
            });
        } else {
            // get default feedback parameters
            let defaultFeedBacks: IDefaultFeedBackSchema[] = await this.defaultFeedBackRepository.gets();

            defaultFeedBacks.forEach((defaultFeedBack) => {
                let jobFeedback: JobRatingParam = new JobRatingParam();
                jobFeedback.title = defaultFeedBack.title;
                jobFeedback.description = defaultFeedBack.description;
                jobFeedback.type = 0;
                jobFeedback.mapid = this.helper.toString(defaultFeedBack._id);
                jobRatingParams.push(jobFeedback);
            });

            let companyFeedBackSchemas: ICompanyFeedBackSchema[] = await this.companyFeedBackRepository.gets(companyId);
            companyFeedBackSchemas.forEach((companyFeedBackSchema) => {
                let jobFeedback: JobRatingParam = new JobRatingParam();
                jobFeedback.title = companyFeedBackSchema.title;
                jobFeedback.description = companyFeedBackSchema.description;
                jobFeedback.type = 1;
                jobFeedback.mapid = this.helper.toString(companyFeedBackSchema._id);
                jobRatingParams.push(jobFeedback);
            });

        }

        return jobRatingParams;
    }

    public async getAllActiveCompanyUser(companyId: string | undefined, userTypeId: number): Promise<ShortUser[]> {

        let users: IUserSchema[] = await this.userRepository.getAllActiveCompanyUser(companyId, userTypeId);

        let newItems: ShortUser[] = [];

        users.forEach((user) => {
            newItems.push(this.helper.convertTo<IUserSchema, ShortUser>(user, new ShortUser()));
        });

        return newItems;
    }

    public async createNewJob(job: Job): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        // Create new job
        let newItem: IJobSchema = this.helper.convertTo<Job, IJobSchema>(job, new JobSchema());
        newItem = await this.jobRepository.save(newItem, session);

        // Create job assignee
        let jobAssignees: IJobAssigneeSchema[] = [];

        job.jobAssignees.forEach((jobAssignee) => {
            let newJobAssignee: IJobAssigneeSchema = new JobAssigneeSchema();
            newJobAssignee.jobId = newItem._id;
            newJobAssignee.assigneeId = jobAssignee.assigneeId;
            jobAssignees.push(newJobAssignee);
        });

        if (jobAssignees.length > 0) {
            await this.jobAssigneeRepository.saveMany(jobAssignees, session);
        }

        // Create rating parameters from job feedback
        let jobFeedBackSchemas: IJobFeedBackSchema[] = [];

        job.jobRatingParams.forEach((parameters) => {
            let jobFeedBackSchema: IJobFeedBackSchema = new JobFeedBackSchema();
            jobFeedBackSchema.title = parameters.title;
            jobFeedBackSchema.description = parameters.description;
            jobFeedBackSchema.jobId = newItem._id;
            jobFeedBackSchema.typeId = parameters.type;
            jobFeedBackSchema.mapId = parameters.mapid;
            jobFeedBackSchemas.push(jobFeedBackSchema);
        });

        if (jobFeedBackSchemas.length > 0) {
            await this.jobFeedBackRepository.saveMany(jobFeedBackSchemas, session);
        }


        await DbSession.Commit(session);
    }

    public async getAllJobHeaders(companyId: string): Promise<Job[]> {
        let jobSchemas: IJobSchema[] = await this.jobRepository.getAllJobHeaders(companyId);

        let newItems: Job[] = [];

        jobSchemas.forEach((jobSchema) => {
            newItems.push(this.helper.convertTo<IJobSchema, Job>(jobSchema, new Job()));
        });

        return newItems;
    }
}