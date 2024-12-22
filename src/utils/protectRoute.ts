import { Response as ExResponse, Request as ExRequest, NextFunction, Application } from "express";

import jwt from 'jsonwebtoken';

export const authenticateJWT = (req: ExRequest, res: ExResponse, next: NextFunction) => {

    (async () => {
        const token = req.header('Authorization')?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Access Denied: No Token Provided' });
        }

        try {
            const secretKey = process.env.SECRET_KEY;
            if (!secretKey) {
                return res.status(500).json({ message: 'Internal Server Error: Secret Key not set' });
            }
            const verified = jwt.verify(token, secretKey);
            (req as any).user = verified;
            next();
        } catch (error) {
            res.status(400).json({ message: 'Invalid Token' });
        }
    })().catch(next);
};

export const applyAuthMiddleware = (app: Application) => {

    const openRoutes = ['/api/auth/signin', '/api/otherpublicroute'];
    app.use((req: ExRequest, res: ExResponse, next: NextFunction) => {
        (async () => {
            if (openRoutes.includes(req.path)) {
                return next();
            }
            return authenticateJWT(req, res, next);
        })().catch(next);
    });
};
