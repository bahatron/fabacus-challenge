import { JsonSchema } from "@bahatron/utils";
import { Route } from "../../app/route";
import { refreshSeatHold } from "./refresh-seat-hold";

const RequestSchema = JsonSchema.Object({
    userId: JsonSchema.String({ format: "uuid" }),
    seatId: JsonSchema.String({ format: "uuid" }),
});

export const RefreshSeatHoldRoute = Route({
    method: "post",
    route: `/events/:eventId/refresh-seat-hold`,
    docs: {
        parameters: [
            {
                in: "path",
                required: true,
                name: "eventId",
                description: "Event ID",
            },
        ],
        requestBody: {
            schema: RequestSchema,
            required: true,
        },
        responses: {
            403: {
                schema: {},
                description: "User cannot do refresh the hold",
            },
            204: {
                schema: {},
                description: "Seat hold refreshed successfully",
            },
        },
    },
    handler: [
        async (req, res) => {
            let { eventId } = req.params;
            let { seatId, userId } = JsonSchema.validate(
                req.body,
                RequestSchema
            );

            await refreshSeatHold({
                eventId,
                userId,
                seatId,
            });

            return res.status(204).json({});
        },
    ],
});
