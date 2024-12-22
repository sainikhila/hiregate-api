import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import ICommonService from "../services/common.service";
import { Enquiry } from "../dto/enquiry";
import { ReqDemo } from "../dto/reqdemo";
import { PricingPlan } from "../dto/pricing";

@Tags("Common")
@Route("api/common")
@provideSingleton(CommonController)
export class CommonController extends BaseController {

    constructor(@inject("ICommonService") private commonService: ICommonService) { super(); }

    @Post("/enquiry")
    public async saveEnquiry(@Body() body: Enquiry): Promise<RequestResponse> {

        try {

            await this.commonService.saveEnquiry(body);

            return this.sendResponse(ResponseCode.Success, "Contact saved successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/requestdemo")
    public async saveRequestDemo(@Body() body: ReqDemo): Promise<RequestResponse> {

        try {

            await this.commonService.saveRequestDemo(body);

            return this.sendResponse(ResponseCode.Success, "Request for demo saved successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/pricingplans")
    public async getPricingPlans(): Promise<RequestResponse> {

        try {

            const pricingPlans: PricingPlan[] = await this.commonService.getPricingPlans();

            return this.sendResponse(ResponseCode.Success, "Retrieved pricing plans successfully", pricingPlans);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}