import { injectable, inject } from "inversify";
import { ClientSession, Error } from "mongoose";
import Helper from "../utils/helper";
import CompanySchema, { ICompanySchema } from "../dao/company";
import DbSession from "../db/dbsession";
import { FilterBy, Pagination, Search, SearchResults, SortBy } from "../dto/search";

/**
 * Interface representing a repository for managing company data.
 */
export interface ICompanyRepository {

    /**
     * Checks if a company with the given id exists.
     * @param id - The id of the company to check.
     * @returns A promise that resolves to a boolean indicating whether the company exists.
     */
    isExist(id: string): Promise<boolean>;

    /**
     * Checks if a company with the given name exists.
     * @param name - The name of the company to check.
     * @returns A promise that resolves to a boolean indicating whether the company exists.
     */
    isExistByName(name: string): Promise<boolean>;

    /**
     * Saves a company to the repository.
     * @param input - The company schema to save.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves to the saved company schema.
     */
    save(input: ICompanySchema, session: ClientSession | undefined): Promise<ICompanySchema>;

    /**
     * Retrieves all companies from the repository.
     * @returns A promise that resolves to an array of company schemas.
     */
    gets(): Promise<ICompanySchema[]>;

    /**
     * Retrieves a company by its ID.
     * @param _id - The ID of the company to retrieve.
     * @returns A promise that resolves to the company schema.
     */
    get(_id: string | unknown): Promise<ICompanySchema>;

    /**
     * Updates a company in the repository.
     * @param input - The company schema to update.
     * @param session - The client session for the operation, if any.
     * @returns A promise that resolves when the update is complete.
     */
    update(input: ICompanySchema, session: ClientSession | undefined): Promise<void>;

    /**
     * Deletes a company from the repository by its ID.
     * @param _id - The ID of the company to delete.
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
}

/**
 * @class CompanyRepository
 * @implements ICompanyRepository
 * @description Repository class for managing company data.
 */
@injectable()
export class CompanyRepository implements ICompanyRepository {

    /**
     * @constructor
     * @param {Helper} helper - Helper instance for utility functions.
     */
    constructor(@inject(Helper) private helper: Helper) { }

    /**
     * Checks if a company with the given id exists.
     * @param id - The id of the company to check.
     * @returns A promise that resolves to a boolean indicating whether the company exists.
     */
    public async isExist(id: string): Promise<boolean> {

        return await CompanySchema.find({ _id: id }, { _id: 1 })
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
     * @method isExist
     * @description Checks if a company with the given name exists.
     * @param {string} name - The name of the company.
     * @returns {Promise<boolean>} - Returns true if the company exists, otherwise false.
    */
    public async isExistByName(name: string): Promise<boolean> {

        return await CompanySchema.find({ name }, { _id: 1 })
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
     * @method save
     * @description Saves a new company to the database.
     * @param {ICompanySchema} input - The company data to save.
     * @param {ClientSession | undefined} session - The database session.
     * @returns {Promise<ICompanySchema>} - A promise that resolves to the saved company data.
     */
    public async save(input: ICompanySchema, session: ClientSession | undefined): Promise<ICompanySchema> {

        return await CompanySchema.create([input], { session })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ICompanySchema;
            })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method gets
     * @description Retrieves all companies from the database.
     * @returns {Promise<ICompanySchema[]>} - A promise that resolves to an array of company data.
     */
    public async gets(): Promise<ICompanySchema[]> {

        return await CompanySchema.find({}, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, -1, []);
                return results as ICompanySchema[];
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * @method get
     * @description Retrieves a company by its ID.
     * @param {string | unknown} _id - The ID of the company to retrieve.
     * @returns {Promise<ICompanySchema>} - A promise that resolves to the company data
     */
    public async get(_id: string | unknown): Promise<ICompanySchema> {

        return await CompanySchema.find({ _id }, { __v: 0 })
            .then((data: any) => {
                let results = this.helper.GetItemFromArray(data, 0, {});
                return results as ICompanySchema;
            })
            .catch((error: Error) => {
                throw error;
            });

    }

    /**
     * @method update
     * @description Updates a company in the database.
     * @param {ICompanySchema} input - The company data to update.
     * @param {ClientSession | undefined} session - The database session.
     */
    public async update(input: ICompanySchema, session: ClientSession | undefined): Promise<void> {

        await CompanySchema.updateOne([input], { session })
            .catch((error: Error) => {
                DbSession.Abort(session);
                throw error;
            });

    }

    /**
     * @method delete
     * @description Deletes a company from the database by its ID.
     * @param {string} _id - The ID of the company to delete.
     */
    public async delete(_id: string): Promise<void> {

        let input: ICompanySchema = await this.get(_id);
        input.recordStatus = 3;

        await CompanySchema.updateOne([input])
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

        let $sort: any = undefined, $match: any = undefined, $limit: any = undefined, $skip: any = undefined;

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

        let $pipeline: any = [];

        // Builds the aggregation pipeline.
        if ($match) $pipeline.push({ $match });
        if ($sort) $pipeline.push({ $sort });
        if ($limit) $pipeline.push($limit);
        if ($skip) $pipeline.push($skip);

        // Executes the aggregation pipeline.
        return await CompanySchema.aggregate($pipeline)
            .then((data: ICompanySchema[]) => {
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
        return await CompanySchema.countDocuments($match)
            .then((count: number) => {
                return count;
            })
            .catch((error: Error) => {
                // Throws an error if the operation fails.
                throw error;
            });
    }
}
