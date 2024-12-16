import { User } from "./user";


export class Company {

    id?: string;
    name: string;
    cinllp: string;
    gstno: string;
    city: string;
    state: string;
    country: string;
    address: string;
    zipcode: string;
    recordStatus?: number;
    createdAt?: Date;
    updatedAt?: Date;
    contact?: User;

    constructor(init?: Partial<Company>) {
        if (init) {
            Object.assign(this, init);
        }
        this.id = this.id;
        this.name = this.name;
        this.cinllp = this.cinllp;
        this.gstno = this.gstno;
        this.city = this.city;
        this.state = this.state;
        this.country = this.country;
        this.address = this.address;
        this.zipcode = this.zipcode;
        this.recordStatus = this.recordStatus;
        this.createdAt = this.createdAt;
        this.updatedAt = this.updatedAt;
        this.contact = this.contact;
    }

}

export class UpdateCompany {
    name?: string;
    cinllp?: string;
    gstno?: string;
    city?: string;
    state?: string;
    country?: string;
    address?: string;
    zipcode?: string;
    recordStatus?: number;
    contact?: User;

    constructor(init?: Partial<UpdateCompany>) {
        if (init) {
            Object.assign(this, init);
        }
        this.name = this.name;
        this.cinllp = this.cinllp;
        this.gstno = this.gstno;
        this.city = this.city;
        this.state = this.state;
        this.country = this.country;
        this.address = this.address;
        this.zipcode = this.zipcode;
        this.recordStatus = this.recordStatus;
        this.contact = this.contact;
    }
}