
import express, { Response as ExResponse, Request as ExRequest, NextFunction } from "express";
import * as bodyParser from "body-parser";
import DbConnection from "./db/db";
import cors from 'cors';
import { RegisterRoutes } from "../build/routes";
import { ValidateError } from "tsoa";
import logger from './logger';
import { ResponseCode } from "./utils/enums";

export const app = express();

DbConnection.initConnection().then(() => {
    DbConnection.setAutoReconnect();

    app.use(bodyParser.urlencoded({
        extended: true,
    }));

    app.use(bodyParser.json());

    app.use(cors({
        origin: 'http://127.0.0.1:8080',
        credentials: true
    }));

    app.use((req: ExRequest, res: ExResponse, next: NextFunction) => {
        res.header("Access-Control-Allow-Origin", "http://127.0.0.1:8080");
        res.header("Access-Control-Allow-Credentials", "true");
        res.header("Access-Control-Allow-Methods", "GET,HEAD,PUT,PATCH,POST,DELETE");
        res.header("Access-Control-Expose-Headers", "Content-Length");
        res.header(
            "Access-Control-Allow-Headers",
            "Accept, Authorization, Content-Type, X-Requested-With, Range"
        );
        (async () => {
            if (req.method === "OPTIONS") {
                return res.sendStatus(200);
            }
            next();
        })().catch(next);
    });

    const logRequests = (req: ExRequest, res: ExResponse, next: NextFunction) => {
        (async () => {
            const { method, url } = req;
            const message = `${method} ${url}`;
            logger.info(message);
            next();
        })().catch(next);
    };

    app.use(logRequests);

    RegisterRoutes(app);

    app.get('/', (req: ExRequest, res: ExResponse, next: NextFunction) => {
        (async () => {
            return res.status(200).send("Api user is running...");
        })().catch(next);
    });

    const FormatErrorFields = (err: ValidateError) => {
        let items: any[] = [];
        let fields = err?.fields;
        let tmp = Object.keys({ ...err?.fields }).map(key => key.split('.')[1]);

        tmp.forEach((item) => {
            items.push({
                field: item,
                message: fields[`body.${item}`]?.message?.replace(/'/g, ''),
            });
        });

        return items;
    }

    const errorHandler = (err: unknown, req: ExRequest, res: ExResponse, next: NextFunction) => {
        (async () => {

            logger.error(err);

            if (err instanceof ValidateError) {
                logger.error(`Caught Validation Error for ${req.path}:`, err.fields);
                return res.status(ResponseCode.BadRequest).json({
                    message: "Validation Failed",
                    status: ResponseCode.BadRequest,
                    data: err?.fields,
                });
            }
            if (err instanceof Error) {
                logger.error(`Caught error ${err.message}:`);
                return res.status(ResponseCode.InternalServerError).json({
                    message: err.message,
                    status: ResponseCode.InternalServerError
                });
            }
            next();
        })().catch(next);
    };

    app.use(errorHandler);
});

