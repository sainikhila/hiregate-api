import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import IUserService from '../services/user.service';
import { BasicUser, UpdateUser, User } from "../dto/user";
import { ResponseCode } from "../utils/enums";
import { CompanyId } from "../utils/constants";
import { Search, SearchResults } from "../dto/search";
import { BaseController } from "./basecontrolller";

@Tags("User")
@Route("api/users")
@provideSingleton(UserController)
export class UserController extends BaseController {

    constructor(@inject("IUserService") private userService: IUserService) { super(); }

    @Post("/list")
    public async getUsers(@Body() body: Search): Promise<RequestResponse> {

        try {

            let results: SearchResults = await this.userService.getUsers(CompanyId, body);

            return this.sendResponse(ResponseCode.Success, "Users retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Get("{userId}")
    public async getUser(@Path() userId: string): Promise<RequestResponse> {

        try {

            let results: User = await this.userService.getUser(userId);

            return this.sendResponse(ResponseCode.Success, "Users retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Post()
    public async saveUser(@Body() body: User): Promise<RequestResponse> {

        try {

            body.companyId = CompanyId;
            await this.userService.saveUser(body);

            return this.sendResponse(ResponseCode.Success, "Users saved successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Post("/basic")
    public async saveBasicUser(@Body() body: BasicUser): Promise<RequestResponse> {

        try {

            let user: User = new User(body);
            user.companyId = CompanyId;

            await this.userService.saveUser(user);

            return this.sendResponse(ResponseCode.Success, "Users saved successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

    @Patch("{userId}")
    public async updateUser(@Path() userId: string, @Body() body: UpdateUser): Promise<RequestResponse> {

        try {

            await this.userService.updateUser(userId, body);

            this.setStatus(ResponseCode.Success);

            return this.sendResponse(ResponseCode.Success, "User updated successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Delete("{userId}")
    public async delete(@Path() userId: string): Promise<RequestResponse> {

        try {

            await this.userService.deleteUser(userId);

            this.setStatus(ResponseCode.Success);


            return this.sendResponse(ResponseCode.Success, "User deleted successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

}