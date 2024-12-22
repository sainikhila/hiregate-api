import { Get, Post, Delete, Tags, Route, Path, Body, Patch, Request } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import { Response as ExResponse, Request as ExRequest } from "express";

@Tags("Job")
@Route("api/job")
@provideSingleton(JobController)
export class JobController extends BaseController {

    constructor() { super(); }

    @Get("/getjobinfo")
    public async getJobInfo(@Request() request: ExRequest): Promise<any> {

        try {
            const user: any = (request as any).user;
            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getmytasks")
    public async getMyTasks(): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getjobshortheaders")
    public async getJobShortHeaders(): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/getjobstatistics")
    public async getJobStatistics(@Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}