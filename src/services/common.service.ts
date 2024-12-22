import { inject, injectable } from "inversify";
import { ClientSession } from "mongoose";
import DbSession from "../db/dbsession";
import Helper from "../utils/helper";

// Repositories
import { IReqDemoRepository } from "../repositories/reqdemo.repository";
import { IEnquiryRepository } from "../repositories/enquiry.repository";
import { IPricingRepository } from "../repositories/pricing.repository";

// Schemas
import EnquirySchema, { IEnquirySchema } from "../dao/enquiry";
import ReqDemoSchema, { IReqDemoSchema } from "../dao/reqdemo";
import PricingSchema, { IPricingSchema } from '../dao/pricing';

// DTOs
import { ReqDemo } from "../dto/reqdemo";
import { Enquiry } from "../dto/enquiry";
import { PricingPlan } from "../dto/pricing";

export default interface ICommonService {
    saveEnquiry(input: Enquiry): Promise<void>;
    saveRequestDemo(input: ReqDemo): Promise<void>;
    getPricingPlans(): Promise<PricingPlan[]>;
}

@injectable()
export class CommonService implements ICommonService {

    constructor(
        @inject(Helper) private helper: Helper,
        @inject('IEnquiryRepository') private enquiryRepository: IEnquiryRepository,
        @inject('IReqDemoRepository') private reqDemoRepository: IReqDemoRepository,
        @inject('IPricingRepository') private pricingRepository: IPricingRepository
    ) { }

    public async saveEnquiry(input: Enquiry): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        let newItem: IEnquirySchema = this.helper.convertTo<Enquiry, IEnquirySchema>(input, new EnquirySchema());

        newItem = await this.enquiryRepository.save(newItem, session);

        await DbSession.Commit(session);
    }

    public async saveRequestDemo(input: ReqDemo): Promise<void> {

        let session: ClientSession = await DbSession.Session();
        DbSession.Start(session);

        let newItem: IReqDemoSchema = this.helper.convertTo<ReqDemo, IReqDemoSchema>(input, new ReqDemoSchema());

        newItem = await this.reqDemoRepository.save(newItem, session);

        await DbSession.Commit(session);
    }

    public async getPricingPlans(): Promise<PricingPlan[]> {

        let results: IPricingSchema[] = await this.pricingRepository.get();

        let newItem: PricingPlan[] = [];

        results.forEach((item: IPricingSchema) => {
            newItem.push(this.helper.convertTo<IPricingSchema, PricingPlan>(item, new PricingPlan()));
        });

        return newItem;
    }

}