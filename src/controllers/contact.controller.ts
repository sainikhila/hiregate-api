import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";

@Tags("contact")
@Route("api/contact")
@provideSingleton(ContactController)
export class ContactController extends BaseController {

    constructor() { super(); }

    @Get("/getcontactinfo")
    public async GetContactInfo(): Promise<any> {

        try {

            return [];

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}