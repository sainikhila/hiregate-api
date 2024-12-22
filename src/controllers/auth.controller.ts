import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import { AuthUser } from "../dto/user";
import IAuthService from "../services/auth.service";

@Tags("Common")
@Route("api/auth")
@provideSingleton(AuthController)
export class AuthController extends BaseController {

    constructor(@inject("IAuthService") private authService: IAuthService) { super(); }

    @Post("/signin")
    public async signin(@Body() body: AuthUser): Promise<any> {

        try {

            return await this.authService.signin(body);

            //const results = await this.authService.signin(body);

            //return this.sendResponse(ResponseCode.Success, "Authenticated successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}