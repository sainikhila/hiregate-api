import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import { AuthUser } from "../dto/user";
import IAuthService from "../services/auth.service";
import Helper from "src/utils/helper";

@Tags("Session")
@Route("api/session")
@provideSingleton(SessionController)
export class SessionController extends BaseController {

    constructor(@inject("Helper") private helper: Helper) { super(); }

    @Post("/getsessionsbystatus")
    public async getSessionsByStatus(@Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/getsessionsbyday")
    public async getSessionsByDay(@Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/getsessionsbytime")
    public async getSessionsByTime(@Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/getsessionsbymonthly")
    public async getSessionsByMonthly(@Body() body: any): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getallsessions")
    public async getAllsessions(): Promise<any> {

        try {

            return this.helper.UniqueId();

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}