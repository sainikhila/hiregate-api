import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import UserSchema, { IUserSchema } from "../dao/user";
import DbSession from "../db/dbsession";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../dto/search";
import e from "express";
import { link } from "fs";

/**
 * Interface representing a user repository.
 */
export interface IUserRepository {
    /**
     * Checks if a user with the given email exists.
     * @param email - The email of the user to check.
     * @returns A promise that resolves to a boolean indicating whether the user exists.
     */
    isExist(email: string): Promise<boolean>;

    /**
     * Checks if a user with the given email exists.
     * @param companyId - The companyId of the user to check.
     * @param email - The email of the user to check.
     * @returns A promise that resolves to a boolean indicating whether the user exists.
     */
    isExistForCompany(companyId: string, email: string): Promise<boolean>;

    /**
     * Saves a user schema to the repository.
     * @param input - The user schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved user schema.
     */
    save(input: IUserSchema, session: ClientSession | undefined): Promise<IUserSchema>;

    /**
     * Retrieves all user schemas from the repository.
     * @returns A promise that resolves to an array of user schemas.
     */
    gets(): Promise<IUserSchema[]>;

    /**
     * Retrieves a user schema by its ID.
     * @param _id - The ID of the user schema to retrieve.
     * @returns A promise that resolves to the retrieved user schema.
     */
    get(_id: string | unknown, exclude?: string[]): Promise<IUserSchema>;

    /**
     * Retrieves a user schema by its ID.
     * @param companyId 
     * @param userId 
     */
    getLoggedInUser(userId: string | unknown): Promise<any>;

    getAllCompanyUser(companyId: string | unknown): Promise<any>;

    /**
     * Updates a user schema in the repository.
     * @param input - The user schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: IUserSchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a user schema from the repository by its ID.
     * @param _id - The ID of the user schema to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    delete(_id: string): Promise<void>;

    /**
    * Searches for user schemas based on the given search criteria.
    * @param search - The search criteria.
    * @returns A promise that resolves to the search results.
    */
    search(search: Search): Promise<SearchResults>;

    /**
     * Gets the count of user schemas based on the given search criteria.
     * @param search - The search criteria.
     * @returns A promise that resolves to the count of user schemas.
     */
    searchCount(search: Search): Promise<number>;

    /**
     * Retrieves a user schema by its email.
     * @param email - The email of the user schema to retrieve.
     * @returns A promise that resolves to the retrieved user schema.
     */
    getUserByEmail(email: string): Promise<IUserSchema>;
}

/**
 * @class UserRepository
 * @implements IUserRepository
 * @description Repository class for managing user data.
 */
@injectable()
export class UserRepository implements IUserRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a user with the given email exists.
     * @param email - The email of the user to check.
     * @returns A promise that resolves to a boolean indicating whether the user exists.
     */
    public async isExist(email: string): Promise<boolean> {

        return await UserSchema.find({ email }, { _id: 1 })
            .then((data: any[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    /**
     * Checks if a user with the given email exists.
     * @param companyId - The companyId of the user to check.
     * @param email - The email of the user to check.
     * @returns A promise that resolves to a boolean indicating whether the user exists.
     */
    public async isExistForCompany(companyId: string, email: string): Promise<boolean> {

        return await UserSchema.find({ companyId, email }, { _id: 1 })
            .then((data: any[]) => {
                let results = this.helper.GetItemFromArray(data, 0, { _id: null });
                if (!this.helper.IsNullValue(results._id)) return true;
                return false;
            })
            .catch((error: Error) => {
                throw error;
            });
    }

    /**
     * Saves a user schema to the repository.
     * @param input - The user schema to save.
     * @param session - The client session, if any.
     * @returns A promise that resolves to the saved user schema.
     */
    public async save(input: IUserSchema, session: ClientSession | undefined): Promise<IUserSchema> {

        return await UserSchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Retrieves all user schemas from the repository.
     * @returns A promise that resolves to an array of user schemas.
     */
    public async gets(): Promise<IUserSchema[]> {

        return await UserSchema.find({}, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IUserSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Retrieves a user schema by its ID.
     * @param _id - The ID of the user schema to retrieve.
     * @returns A promise that resolves to the retrieved user schema.
     */
    public async get(_id: string | unknown, exclude?: string[]): Promise<IUserSchema> {

        let excludes: any = { __v: 0 };

        exclude?.forEach((e: string) => { excludes[e] = 0; });

        return await UserSchema.find({ _id }, excludes)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async getLoggedInUser(userId: string | unknown): Promise<any> {

        let $pipeline = [

            { $match: { _id: this.helper.ObjectId(userId) } },
            {
                $lookup: {
                    from: "companies",
                    localField: "companyId",
                    foreignField: "_id",
                    pipeline: [
                        {
                            $project: {
                                name: 1,
                                website: 1
                            }
                        }
                    ],
                    as: "company"
                }
            },
            { $unwind: { path: "$company", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name: 1,
                    gender: 1,
                    photo: 1,
                    userTypeId: 1,
                    company: "$company.name",
                    website: "$company.website"
                }
            }

        ];

        return await UserSchema.aggregate($pipeline)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    public async getAllCompanyUser(companyId: string | unknown): Promise<any> {

        let $pipeline = [

            { $match: { companyId: this.helper.ObjectId(companyId) } },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id",
                    foreignField: "mapId",
                    as: "address"
                }
            },
            { $unwind: { path: "$address", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "professionals",
                    localField: "_id",
                    foreignField: "userId",
                    as: "professional"
                }
            },
            { $unwind: { path: "$professional", preserveNullAndEmptyArrays: true } },
            {
                $lookup: {
                    from: "skills",
                    localField: "_id",
                    foreignField: "userId",
                    as: "skill"
                }
            },
            { $unwind: { path: "$skill", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    id: "$_id",
                    _id: 0,
                    name: 1,
                    email: 1,
                    gender: 1,
                    dailingCode: "$address.dailingCode",
                    mobileNumber: 1,
                    city: "$address.city",
                    state: "$address.state",
                    country: "$address.country",
                    location: { $concat: ["$address.city", " ", "$address.country"] },
                    ctc: "$professional.ctc",
                    ectc: "$professional.expctc",
                    linkedIn: "$professional.linkedIn",
                    resume: "$professional.resume",
                    photo: 1,
                    years: { $concat: [this.helper.Padding(8, 2), ".", this.helper.Padding(5, 2)] },
                    internal: 1,
                    timeZone: 1,
                    skills: ".net, c#, angular",
                    rating: '3',
                    reviewsCount: '2',
                    experience: "5 years"
                }
            }

        ];

        return await UserSchema.aggregate($pipeline)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as IUserSchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Retrieves a user schema by its email.
     * @param email - The email of the user schema to retrieve.
     * @returns A promise that resolves to the retrieved user schema.
     */
    public async getUserByEmail(email: string): Promise<IUserSchema> {

        let excludes: any = { __v: 0 };

        return await UserSchema.find({ email: { $regex: email, $options: 'i' } }, excludes)
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as IUserSchema;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * Updates a user schema in the repository.
     * @param input - The user schema to update.
     * @param session - The client session, if any.
     * @returns A promise that resolves when the update is complete.
     */
    public async update(input: IUserSchema, session: ClientSession | undefined): Promise<void> {

        await UserSchema.updateOne({ _id: input._id }, input, { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * Deletes a user schema from the repository by its ID.
     * @param _id - The ID of the user schema to delete.
     * @returns A promise that resolves when the deletion is complete.
     */
    public async delete(_id: string): Promise<void> {

        let input: IUserSchema = await this.get(_id);
        input.recordStatus = 3;

        await UserSchema.updateOne({ _id }, input)
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
    * Searches for user schemas based on the given search criteria.
    * @param search - The search criteria.
    * @returns A promise that resolves to the search results.
    */
    public async search(search: Search): Promise<SearchResults> {

        let $sort: any = undefined, $match: any = undefined, $limit:
            any = undefined, $skip: any = undefined, $project: any = { __v: 0 };

        // Processes the sort criteria.
        if (!this.helper.IsArrayNull(search.sort)) {
            search.sort?.forEach((e: SortBy) => {
                let sortBy: SortBy = new SortBy(e);
                $sort = { ...$sort, [sortBy.name]: sortBy.getOrder() };
            });
        }

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Processes the pagination criteria.
        if (!this.helper.IsJsonNull(search.pagination)) {
            let pagination: Pagination = new Pagination(search.pagination);
            $limit = { $limit: pagination.getLimit() };
            $skip = { $skip: pagination.getOffset() };
        }

        // Gets the total count of records matching the search criteria.
        let recordCount = await this.searchCount(search);

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.exclude)) {
            search.exclude?.forEach((e: string) => {
                $project[e] = 0;
            });
        }

        let $pipeline: any = [{ $project }];

        // Builds the aggregation pipeline.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Executes the aggregation pipeline.
        return await UserSchema.aggregate($pipeline)
            .then((data: IUserSchema[]) => {
                let results: SearchResults = new SearchResults();
                results.rowsCount = recordCount;
                results.rows = this.helper.GetItemFromArray(data, -1, []);
                return results;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });

    }

    /**
     * Gets the count of user schemas based on the given search criteria.
     * @param search - The search criteria.
     * @returns A promise that resolves to the count of user schemas.
     */
    public async searchCount(search: Search): Promise<number> {

        let $match = {};

        // Processes the filter criteria.
        if (!this.helper.IsArrayNull(search.filter)) {
            // Build the match object dynamically based on the filter criteria.
            let filterBy: FilterBy = new FilterBy();
            let _$match: any = filterBy.getMatchQuery(search.filter);
            if (_$match) {
                // Build the match object dynamically.
                $match = { ...$match, ..._$match };
            }
        }

        // Executes the count query.
        return await UserSchema.countDocuments($match)
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
