import { Get, Post, Delete, Tags, Route, Path, Body, Patch, Request } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import { ResponseCode, UserTypes } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import { Request as ExRequest } from "express";
import Helper from "../utils/helper";
import { Job } from "../dto/jobdetails";
import IJobService from "../services/job.service";
import RequestResponse from "../utils/requestResponse";

@Tags("Job")
@Route("api/job")
@provideSingleton(JobController)
export class JobController extends BaseController {

    constructor(
        @inject("Helper") private helper: Helper,
        @inject("IJobService") private jobService: IJobService
    ) { super(); }


    @Get("/getFeedBacks/{jobId}")
    public async getFeedBacks(@Request() request: ExRequest, @Path() jobId: string): Promise<RequestResponse> {

        try {

            const user: any = (request as any).user;

            const results = await this.jobService.getFeedBacks(jobId, user.companyId);

            return this.sendResponse(ResponseCode.Success, "Job feedbacks retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/CreateNewJob")
    public async CreateNewJob(@Request() request: ExRequest, @Body() body: any): Promise<RequestResponse> {

        try {

            const user: any = (request as any).user;

            const job: Job = new Job(body);
            job.companyId = user.companyId;
            job.createdBy = user.id;
            job.jobId = this.helper.TimeStamp();
            job.recordStatus = 1;

            await this.jobService.createNewJob(job);

            return this.sendResponse(ResponseCode.Success, "Create new job successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getjobheaders")
    public async getJobHeaders(@Request() request: ExRequest): Promise<RequestResponse> {

        try {
            const user: any = (request as any).user;

            const results = await this.jobService.getAllJobHeaders(user.companyId);

            return this.sendResponse(ResponseCode.Success, "Company jobs are retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getmytasks")
    public async getMyTasks(@Request() request: ExRequest): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getjobinfo")
    public async getJobInfo(@Request() request: ExRequest): Promise<any> {

        try {
            const user: any = (request as any).user;
            const results = await this.jobService.getJobInfo(user.companyId);
            return this.sendResponse(ResponseCode.Success, "Company jobs are retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getjobshortheaders")
    public async getJobShortHeaders(@Request() request: ExRequest): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/getjobstatistics")
    public async getJobStatistics(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetJobDetails/{jobId}")
    public async GetJobDetails(@Request() request: ExRequest, @Path() jobId: string): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetJobFullDetails/{jobId}")
    public async GetJobFullDetails(@Request() request: ExRequest, @Path() jobId: string): Promise<any> {

        try {

            const results = await this.jobService.getJobFullDetails(jobId);

            return this.sendResponse(ResponseCode.Success, "All active company users are retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetJobAssignees")
    public async GetJobAssignees(@Request() request: ExRequest): Promise<RequestResponse> {

        try {

            const user: any = (request as any).user;

            const results = await this.jobService.getAllActiveCompanyUser(user.companyId, UserTypes.Contact);

            return this.sendResponse(ResponseCode.Success, "All active company users are retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/UpdateExistingJob")
    public async UpdateExistingJob(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }
    }

    @Post("/PublishExistingJob")
    public async PublishExistingJob(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetUserJobInfo")
    public async GetUserJobInfo(@Request() request: ExRequest): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetJobList")
    public async GetJobList(@Request() request: ExRequest): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetAllScheduledJobs")
    public async GetAllScheduledJobs(@Request() request: ExRequest): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/GetJobImport/{file}")
    public async GetJobImport(@Request() request: ExRequest, @Path() file: string): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/GetJobStatistics")
    public async GetJobStatistics(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/UpdateJobEndDate")
    public async UpdateJobEndDate(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/UpdateJobContact")
    public async UpdateJobContact(@Request() request: ExRequest, @Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }
}