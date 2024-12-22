

export class ReqDemo {
    name: string;
    email: string;
    phone: string;
    company: string;
    city: string;
    country: string;

    constructor(init?: Partial<ReqDemo>) {
        if (init) {
            Object.assign(this, init);
        }
        this.name = this.name;
        this.email = this.email;
        this.phone = this.phone;
        this.company = this.company;
        this.city = this.city;
        this.country = this.country;
    }
}
