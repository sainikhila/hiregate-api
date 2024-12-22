
export class Details {
    label: string;
    items: string[];

    constructor(init?: Partial<Details>) {
        if (init) {
            Object.assign(this, init);
        }
        this.label = this.label;
        this.items = this.items;
    }
}


export class PricingPlan {
    name: string;
    price: Number;
    plantype: string;
    plan: string;
    details: Details[];

    constructor(init?: Partial<PricingPlan>) {
        if (init) {
            Object.assign(this, init);
        }
        this.name = this.name;
        this.price = this.price;
        this.plantype = this.plantype;
        this.plan = this.plan;
        this.details = this.details
    }
}