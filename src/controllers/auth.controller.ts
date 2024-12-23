import { Get, Post, Delete, Tags, Route, Path, Body, Patch, Request } from "tsoa";
import { Request as ExRequest } from "express";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import { AuthUser, TokenUser } from "../dto/user";
import IAuthService from "../services/auth.service";

@Tags("Common")
@Route("api/auth")
@provideSingleton(AuthController)
export class AuthController extends BaseController {

    constructor(@inject("IAuthService") private authService: IAuthService) { super(); }

    @Post("/signIn")
    public async signin(@Body() body: AuthUser): Promise<RequestResponse> {

        try {

            const results = await this.authService.signin(body);

            return this.sendResponse(ResponseCode.Success, "Authenticated successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Get("/getLoggedInUser")
    public async getLoggedInUser(@Request() request: ExRequest): Promise<RequestResponse> {

        try {

            const tokenUser: TokenUser = (request as any).user;

            // Generate jd profile for the selected user

            const results = await this.authService.getLoggedInUser(tokenUser.id);

            return this.sendResponse(ResponseCode.Success, "Authenticated successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}