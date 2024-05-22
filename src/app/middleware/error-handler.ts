import { ErrorRequestHandler } from "express";
import { Log } from "../../services/logger";
import { Session } from "../../services/session";
import { Env } from "../../services/env";

export const ERROR_HANDLER_MIDDLEWARE: ErrorRequestHandler = (
    err,
    req,
    res,
    next
) => {
    let code = isNaN(err.code) || err.code >= 600 ? 500 : parseInt(err.code);

    let requestId = Session.getStore()?.request_id;

    let context = {
        error: err,
        error_code: err.code,
        error_context: err.context,
        request_headers: req.headers,
        request_body: req.body,
        request_params: req.params,
        request_query: req.query,
    };

    if (code >= 500) {
        Log.error(context, err.message);
    } else {
        Log.warn(context, err.message);
    }

    return res.status(code).json({
        error: err.message,
        context: Env.DEV_MODE ? err.context : undefined,
        request_id: requestId,
    });
};
