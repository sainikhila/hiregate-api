import { Controller } from "tsoa";
import RequestResponse from "../utils/requestResponse";
import { ResponseCode } from "../utils/enums";


export abstract class BaseController extends Controller {

    protected sendResponse(status: ResponseCode, message: string, data: any = undefined): RequestResponse {
        this.setStatus(status);
        if (data) {
            return { status, message, Results: data };
        }
        return { status, message };
    }
}