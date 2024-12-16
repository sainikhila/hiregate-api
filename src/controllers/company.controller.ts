import { Get, Post, Delete, Tags, Route, Path, Body, Patch } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import RequestResponse from "../utils/requestResponse";
import ICompanyService from './../services/company.service';
import { Company, UpdateCompany } from "../dto/company";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";

@Tags("Company")
@Route("api/company")
@provideSingleton(CompanyController)
export class CompanyController extends BaseController {

    constructor(@inject("ICompanyService") private companyService: ICompanyService) { super(); }

    @Get()
    public async getCompanies(): Promise<Company[] | RequestResponse> {

        try {

            let results: any = await this.companyService.getCompanies();

            return this.sendResponse(ResponseCode.Success, "Companies retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Get("{companyId}")
    public async getCompany(@Path() companyId: string): Promise<RequestResponse> {

        try {

            let results: any = await this.companyService.getCompany(companyId);

            return this.sendResponse(ResponseCode.Success, "Companies retrieved successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Post()
    public async saveCompany(@Body() body: Company): Promise<RequestResponse> {

        try {

            await this.companyService.saveCompany(body);

            return this.sendResponse(ResponseCode.Success, "Company saved successfully");

        } catch (ex: any) {
            console.log(ex)
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Patch("{companyId}")
    public async updateCompany(@Path() companyId: string, @Body() body: UpdateCompany): Promise<RequestResponse> {

        try {

            await this.companyService.updateCompany(companyId, body);

            return this.sendResponse(ResponseCode.Success, "Company updated successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

    @Delete("{companyId}")
    public async delete(@Path() companyId: string): Promise<RequestResponse> {

        try {

            await this.companyService.deleteCompany(companyId);

            return this.sendResponse(ResponseCode.Success, "Company deleted successfully");

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message);
        }

    }

}