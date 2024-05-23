import { describe } from "node:test";
import { PingRoute } from "./ping.route";
import axios from "axios";

async function callPing() {
    return axios({
        method: PingRoute.method,
        url: PingRoute.route,
    });
}

describe(`${PingRoute.method.toUpperCase()} ${PingRoute.route}`, () => {
    it("returns http 200", async () => {
        let res = await callPing();

        expect(res.status).toBe(200);
    });
});
