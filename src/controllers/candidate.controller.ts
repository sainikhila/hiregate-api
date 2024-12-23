import { Get, Post, Delete, Tags, Route, Path, Body, Patch, Request } from "tsoa";
import { inject, provideSingleton } from "../utils/provideSingleton";
import { ResponseCode } from "../utils/enums";
import { BaseController } from "./basecontrolller";
import ICandidateService from "../services/candidate.service";
import { Request as ExRequest } from "express";
import { TokenUser } from "../dto/user";

@Tags("Candidate")
@Route("api/candidate")
@provideSingleton(CandidateController)
export class CandidateController extends BaseController {

    constructor(
        @inject("ICandidateService") private candidateService: ICandidateService,
        //@inject("IProfessionalRepository") private professionalRepository: IProfessionalRepository
    ) { super(); }

    @Get("/getallcandidates")
    public async GetAllCandidates(@Request() request: ExRequest): Promise<any> {

        try {

            const tokenUser: TokenUser = (request as any).user;

            /* let address: any = {
                month: 5,
                year: 8,
                ctc: "500000",
                expctc: "600000",
                linkedIn: "https://www.linkedin.com",
                recordStatus: 1,
                userId: tokenUser.id
            };

            this.professionalRepository.save(address as IProfessionalSchema, undefined); */

            const results = await this.candidateService.getAllCandidates(tokenUser.companyId);

            return this.sendResponse(ResponseCode.Success, "Authenticated successfully", results);

        } catch (ex: any) {
            return this.sendResponse(ResponseCode.BadRequest, ex.message, null);
        }

    }

}