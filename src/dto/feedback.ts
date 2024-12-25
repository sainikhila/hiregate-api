

export class FeedBack {
    id?: string;
    title: string;
    description: string;
    companyId?: string | null = null;
    jobId?: string | null = null;
    default: boolean;
    selected: boolean = false;

    constructor(init?: Partial<FeedBack>) {
        if (init) {
            Object.assign(this, init);
        }

        this.id = this.id;
        this.title = this.title;
        this.description = this.description;
        this.companyId = this.companyId;
        this.jobId = this.jobId;
        this.default = this.default;
        this.selected = this.selected;
    }
}