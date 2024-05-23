import { seatKey } from "../models/event.schema";
import { Redis } from "../services/redis";

export async function cleanEventSeats(seats: string[]) {
    let multi = Redis.multi();

    for (let seat of seats) {
        multi.del(seatKey(seat));
    }

    await multi.exec();
}
