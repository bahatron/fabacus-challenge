import { JsonSchema } from "@bahatron/utils";
import { Route } from "../../app/route";
import { reserveSeat } from "./reserve-seat";

const RequestSchema = JsonSchema.Object({
    userId: JsonSchema.String({ format: "uuid" }),
    seatId: JsonSchema.String({ format: "uuid" }),
});

export const ReserveSeatRoute = Route({
    method: "post",
    route: `/events/:eventId/reserve-seat`,
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
            410: {
                schema: {},
                description: "Seat already taken",
            },
            204: {
                schema: {},
                description: "Seat reserved successfuly",
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

            await reserveSeat({
                eventId,
                userId,
                seatId,
            });

            return res.status(204).json({});
        },
    ],
});
