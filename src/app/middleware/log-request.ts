import { RequestHandler } from "express";
import { Log } from "../../services/logger";

function calculateHrDurationInMs(startTime: [number, number]) {
    const hrDuration = process.hrtime(startTime);
    const hrDurationMs = hrDuration[0] * 1000 + hrDuration[1] / 1000000;

    return `${hrDurationMs.toFixed(3)}ms`;
}

export const REQUEST_LOGGER_MIDDLEWARE: RequestHandler = (req, res, next) => {
    let hrTime = process.hrtime();

    res.once("close", () => {
        let duration = calculateHrDurationInMs(hrTime);

        Log.info(
            {
                method: req.method.toUpperCase(),
                statusCode: res.statusCode,
                url: req.originalUrl,
                duration: duration,
            },
            "request completed"
        );
    });

    next();
};
