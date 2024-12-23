const Types = require('mongoose').Types;
import { provideSingleton } from "../utils/provideSingleton";
import mongoose from 'mongoose';
import jwt, { JwtPayload } from 'jsonwebtoken';

@provideSingleton(Helper)
export default class Helper {

    constructor() { }

    public IsNull(e: any): Boolean {
        if (e === undefined || e === null) return true;
        return false;
    }

    public IsNullValue(e: any): Boolean {
        if (e === undefined || e === null || e === "" || e === "undefined") return true;
        return false;
    }

    public ChangeToExactDecimal(v: any): void {
        if (v !== null && typeof v === "object") {
            Object.entries(v).forEach(([key, value]) => {
                if (v[key] && v[key].constructor.name === "Decimal128") {
                    if (!this.IsNullValue(v[key])) {
                        v[key] = parseFloat(v[key]);
                    }
                }
            });
        }
    };

    public IsArrayNull(e: any): Boolean {
        if (this.IsNull(e)) return true;
        if (e.length > 0) {
            return false;
        }
        return true;
    };

    public IsJsonNull(e: any): Boolean {
        if (this.IsNull(e)) return true;
        for (var key in e) {
            if (Object.prototype.hasOwnProperty.call(e, key)) {
                return false;
            }
        }
        return true;
    };

    public SetToJSON(v: any): void {
        if (!this.IsNullValue(v)) {
            v.set("toJSON", {
                getters: true,
                transform: (_, ret: any) => {
                    this.ChangeToExactDecimal(ret);
                    delete ret.__v;
                    delete ret.id;
                    return ret;
                },
            });
        }
    };

    public GetItemFromArray(arr: any, pos: number, defa: any): any {
        if (!this.IsArrayNull(arr)) {
            return pos > -1 ? arr[pos] : arr;
        }
        return defa;
    };

    public CloneObject(x: any): any {
        if (!this.IsNullValue(x)) {
            return JSON.parse(JSON.stringify(x));
        }
        return null;
    }

    public ObjectId(id: any): any {
        return new Types.ObjectId(id);
    };

    public ToDateOnly = (e: any) => {
        if (this.IsNullValue(e)) return null;
        return new Date(e);
    };

    public convertDAO1<T extends {}, K extends {}>(source: T, target: K): K {
        const fields = Object.keys(source) as (keyof T)[];

        fields.forEach(field => {
            if (field === 'id') {
                (target as any)["_id"] = source[field];
            } else {
                (target as any)[field] = source[field];
            }
        });

        return target;
    }

    public convertTo<T extends {}, K extends {}>(source: T, target: K): K {
        let fields = Object.keys(target) as (keyof T)[];

        if (target["_doc"]) {
            fields = Object.keys(source) as (keyof T)[];
        }

        fields.forEach(field => {

            let tValue: any = null;
            tValue = (source as any)[field];

            if (this.isValidObjectId(tValue)) {
                tValue = tValue?.toString();
            }

            (target as any)[field] = tValue;
        });

        return target;
    }

    public convertTo1<T extends {}, K extends {}>(source: T, target: K, dao: boolean = false): K {
        let fields = Object.keys(target) as (keyof T)[];

        if (dao) {
            fields = Object.keys(source) as (keyof T)[];
        }

        fields.forEach(field => {
            if (field === 'id' && '_id' in source) {
                (target as any)[field] = (source as any)["_id"];
            } else if (field === '_id' && 'id' in source) {
                (target as any)[field] = (source as any)["id"];
            } else if (field in source) {
                (target as any)[field] = (source as any)[field];
            }
        });

        return target;
    }

    public isValidObjectId = (id: any): boolean => {
        return mongoose.Types.ObjectId.isValid(id);
    }

    public toObjectId = (id: any): mongoose.Types.ObjectId => {
        return new mongoose.Types.ObjectId(id);
    };

    public toString = (id: any): string => {
        return id.toString();
    }

    public async GenerateJwtToken(input: any, key: string): Promise<any> {
        return new Promise(async (resolve) => {

            const SESSION_TIMOUT: number = parseInt(process.env.SESSION_TIMOUT || '60000', 0);

            let expired = SESSION_TIMOUT * 60;

            const payload = Object.assign({}, input);

            if (!process.env.SECRET_KEY) {
                return resolve('');
            }

            const token = jwt.sign(payload, process.env.SECRET_KEY, {
                algorithm: "HS256",
                subject: payload[key].toString(),
                expiresIn: expired,
            });

            return resolve({ access_token: token, expires_in: expired, token_type: "Bearer" });
        });
    };

    public Padding = (e: any, num: number): string => {
        console.log(e);
        if (this.IsNullValue(e)) {
            return "".padStart(num, '0');
        }
        return e.toString().padStart(num, '0');
    };
}
