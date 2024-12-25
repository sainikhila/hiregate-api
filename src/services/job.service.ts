import { inject, injectable } from "inversify";
import Helper from "../utils/helper";

// Repositories
import { IDefaultFeedBackRepository } from "../repositories/defaultfeedback.repository";
import { DefaultFeedBack } from "../dto/defafeedbacks";
import DefaultFeedBackSchema, { IDefaultFeedBackSchema } from "../dao/defaultfeedback";
import { IFeedBackRepository } from "../repositories/feedback";
import { IFeedBackSchema } from "../dao/feedback";
import { FeedBack } from "../dto/feedback";
import { IJobFeedBackRepository } from "../repositories/jobfeedback";
import { ShortUser } from "../dto/user";
import { IUserRepository } from "../repositories/user.repository";
import { IUserSchema } from "../dao/user";

export default interface IJobService {
    getDefaultFeedBacks(): Promise<any>;
    setDefaultFeedBacks(defaultFeedBacks: DefaultFeedBack[]): Promise<any>;
    getFeedBackForJob(jobId: string | undefined, companyId: string | undefined);
    getFeedBackForNewJob(companyId: string | undefined);
    getAllActiveCompanyUser(companyId: string | undefined, userTypeId: number): Promise<ShortUser[]>;
}

@injectable()
export class JobService implements IJobService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IDefaultFeedBackRepository') private defaultFeedBackRepository: IDefaultFeedBackRepository,
        @inject('IFeedBackRepository') private feedBackRepository: IFeedBackRepository,
        @inject('IJobFeedBackRepository') private jobFeedBackRepository: IJobFeedBackRepository,
        @inject('IUserRepository') private userRepository: IUserRepository
    ) { }

    public async getDefaultFeedBacks(): Promise<any> {
        return await this.defaultFeedBackRepository.gets();
    }

    public async setDefaultFeedBacks(defaultFeedBacks: DefaultFeedBack[]): Promise<void> {

        let newItems: IDefaultFeedBackSchema[] = [];

        defaultFeedBacks.forEach((defaultFeedBack) => {
            newItems.push(this.helper.convertTo<DefaultFeedBack, IDefaultFeedBackSchema>(defaultFeedBack, new DefaultFeedBackSchema()));
        });

        return await this.defaultFeedBackRepository.save(newItems);
    }

    public async getFeedBackForJob(jobId: string | undefined, companyId: string | undefined): Promise<FeedBack[]> {

        let feedBacks: FeedBack[] = [];
        let feedBackCount = await this.feedBackRepository.count(companyId);

        let newItems: IFeedBackSchema[] = [];

        if (feedBackCount === 0) {
            const defaFeedBacks: any = await this.getDefaultFeedBacks();
            defaFeedBacks.forEach((defaFeedBack: IDefaultFeedBackSchema) => {
                newItems.push({ companyId, title: defaFeedBack.title, description: defaFeedBack.description } as IFeedBackSchema);

            });

            newItems = await this.feedBackRepository.save(defaFeedBacks);
        }

        if (this.helper.IsNullValue(jobId)) {
            newItems.forEach((feedBackSchema: IFeedBackSchema) => {
                let feedBack: FeedBack = new FeedBack();
                feedBack.title = feedBackSchema.title;
                feedBack.description = feedBackSchema.description;
                feedBack.companyId = feedBackSchema.companyId;
                feedBack.jobId = jobId;
                feedBacks.push(feedBack);
            });
        } else {
            feedBacks = await this.jobFeedBackRepository.get(companyId, jobId);
        }

        return feedBacks;
    }

    public async getFeedBackForNewJob(companyId: string | undefined): Promise<FeedBack[]> {

        let feedBacks: FeedBack[] = [];

        // Get default feedbacks
        const defaFeedBacks: any = await this.getDefaultFeedBacks();
        defaFeedBacks.forEach((defaFeedBack: IDefaultFeedBackSchema) => {
            feedBacks.push(
                new FeedBack({
                    id: this.helper.toString(defaFeedBack._id), default: true,
                    title: defaFeedBack.title, description: defaFeedBack.description
                })
            );
        });

        let newItems: IFeedBackSchema[] = await this.feedBackRepository.gets(companyId);

        newItems.forEach((feedBackSchema: IFeedBackSchema) => {
            let feedBack: FeedBack = new FeedBack();
            feedBack.title = feedBackSchema.title;
            feedBack.description = feedBackSchema.description;
            feedBack.companyId = feedBackSchema.companyId;
            feedBacks.push(feedBack);
        });

        return feedBacks;
    }

    public async getAllActiveCompanyUser(companyId: string | undefined, userTypeId: number): Promise<ShortUser[]> {

        let users: IUserSchema[] = await this.userRepository.getAllActiveCompanyUser(companyId, userTypeId);

        let newItems: ShortUser[] = [];

        users.forEach((user) => {
            newItems.push(this.helper.convertTo<IUserSchema, ShortUser>(user, new ShortUser()));
        });

        return newItems;
    }
}