
export class AuthUser {
    email: string;
    password: string;

    constructor(init?: Partial<AuthUser>) {
        if (init) {
            Object.assign(this, init);
        }
        this.email = this.email;
        this.password = this.password;
    }
}

export class ShortUser {
    id?: string;
    name: string;
    email: string;
    mobileNumber: string;
    selected: boolean = false;

    constructor(init?: Partial<ShortUser>) {
        if (init) {
            Object.assign(this, init);
        }
        this.id = this.id;
        this.name = this.name;
        this.email = this.email;
        this.mobileNumber = this.mobileNumber;
        this.selected = this.selected;
    }
}


export class BasicUser {
    name: string;
    email: string;
    mobileNumber: string;
    userTypeId: number;

    constructor(init?: Partial<BasicUser>) {
        if (init) {
            Object.assign(this, init);
        }

        this.name = this.name;
        this.email = this.email;
        this.mobileNumber = this.mobileNumber;
        this.userTypeId = this.userTypeId;
    }
}

export class User extends BasicUser {
    id?: string;
    password?: string;
    location: string;
    gender?: string | null | undefined;
    landline?: string | null | undefined;
    dailingCode?: string | null | undefined;
    userTypeId: number;
    companyId?: string | unknown;
    recordStatus?: number;
    createdAt?: Date;
    updatedAt?: Date;

    constructor(init?: Partial<User>) {
        super(init);
        if (init) {
            Object.assign(this, init);
        }
        this.id = this.id;
        this.password = this.password;
        this.location = this.location;
        this.gender = this.gender;
        this.landline = this.landline;
        this.dailingCode = this.dailingCode;
        this.userTypeId = this.userTypeId;
        this.companyId = this.companyId;
        this.recordStatus = this.recordStatus;
        this.createdAt = this.createdAt;
        this.updatedAt = this.updatedAt;
    }
}

export class UpdateUser extends BasicUser {
    password?: string;
    location?: string;
    gender?: string | null | undefined;
    landline?: string | null | undefined;
    dailingCode?: string | null | undefined;
    recordStatus?: number;

    constructor(init?: Partial<UpdateUser>) {
        super(init);
        if (init) {
            Object.assign(this, init);
        }

        this.password = this.password;
        this.location = this.location;
        this.gender = this.gender;
        this.landline = this.landline;
        this.dailingCode = this.dailingCode;
        this.recordStatus = this.recordStatus;
    }

}

export class TokenUser extends BasicUser {
    id: string;
    companyId: string;
    recordStatus?: number;

    constructor(init?: Partial<UpdateUser>) {
        super(init);
        if (init) {
            Object.assign(this, init);
        }

        this.id = this.id;
        this.companyId = this.companyId;
        this.recordStatus = this.recordStatus;
    }

}

export class Token {
    access_token: string;
    expires_in: number;
    token_type: string;

    constructor(init?: Partial<Token>) {
        if (init) {
            Object.assign(this, init);
        }

        this.access_token = this.access_token;
        this.expires_in = this.expires_in;
        this.token_type = this.token_type;
    }

}
