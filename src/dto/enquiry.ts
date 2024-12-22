

export class Enquiry {
    name: string;
    email: string;
    mobileNumber?: string;
    message: string;
    subject: string;

    constructor(init?: Partial<Enquiry>) {
        if (init) {
            Object.assign(this, init);
        }
        this.name = this.name;
        this.email = this.email;
        this.mobileNumber = this.mobileNumber;
        this.message = this.message;
        this.subject = this.subject;
    }
}