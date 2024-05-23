import { JsonSchema } from "@bahatron/utils";
import { Route } from "../../app/route";
import { holdSeat } from "./hold-seat";

const HoldSeatRequest = JsonSchema.Object({
    userId: JsonSchema.String({ format: "uuid" }),
    seatId: JsonSchema.String({ format: "uuid" }),
});

export const HoldSeatRoute = Route({
    method: `post`,
    route: `/events/:eventId/hold-seat`,
    docs: {
        parameters: [
            {
                in: "path",
                name: "eventId",
                type: "string",
                description: "Event ID",
            },
        ],
        requestBody: {
            schema: HoldSeatRequest,
        },
        responses: {
            204: {
                schema: {},
                description: "Operation successful",
            },
            404: {
                schema: {},
                description: "Seat not found",
            },
            410: {
                schema: {},
                description: "Seat already taken",
            },
            406: {
                schema: {},
                description: "User has too many seats reserved",
            },
        },
    },
    handler: [
        async (req, res) => {
            let { eventId } = req.params;

            let { userId, seatId } = JsonSchema.validate(
                req.body,
                HoldSeatRequest
            );

            await holdSeat({ eventId, userId, seatId });

            return res.status(204).json();
        },
    ],
});
