import { randomUUID } from "crypto";
import { RequestHandler } from "express";
import { Session } from "../../services/session";

export const REQUEST_ID_MIDDLEWARE: RequestHandler = async (req, res, next) => {
    try {
        let requestId = (req.headers["x-request-id"] || randomUUID()) as string;

        Session.run({ request_id: requestId }, next);
    } catch (err) {
        return next(err);
    }
};
