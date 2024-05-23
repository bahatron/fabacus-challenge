import { JsonSchema } from "@bahatron/utils";
import { Static } from "@bahatron/utils/lib/json-schema";

export const eventKey = (eventId: string) => `event:${eventId}`;
export const seatKey = (seatId: string) => `seat:${seatId}`;

export type Event = Static<typeof EventSchema>;
export const EventSchema = JsonSchema.Object({
    id: JsonSchema.String({ format: "uuid" }),
    reservationDuration: JsonSchema.Integer(),
    maxSeatsPerUser: JsonSchema.Optional(JsonSchema.Integer()),
    seats: JsonSchema.Array(JsonSchema.String({ format: "uuid" }), {
        minItems: 10,
        maxItems: 1000,
    }),
});

export type EventExtended = Static<typeof EventExtendedSchema>;
export const EventExtendedSchema = JsonSchema.Composite([
    JsonSchema.Omit(EventSchema, ["seats"]),
    JsonSchema.Object({
        seats: JsonSchema.Record(
            JsonSchema.String({ format: "uuid" }),
            JsonSchema.Nullable(JsonSchema.String({ format: "uuid" }))
        ),
    }),
]);
