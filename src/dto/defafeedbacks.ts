

export class DefaultFeedBack {
    title: string;
    description: string;

    constructor(init?: Partial<DefaultFeedBack>) {
        if (init) {
            Object.assign(this, init);
        }

        this.title = this.title;
        this.description = this.description;
    }
}