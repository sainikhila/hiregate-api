

export enum UserTypes {
    Contact = 1,
    Candidate = 2,
    Interviewer = 3
}

export enum StatusTypes {
    Active = 1,
    Inactive = 2,
    Deleted = 3,
    Pending = 4,
    Approved = 5,
    Completed = 6
}

export enum ResponseCode {
    Success = 200,
    BadRequest = 400,
    Unauthorized = 401,
    Forbidden = 403,
    NotFound = 404,
    InternalServerError = 500
}