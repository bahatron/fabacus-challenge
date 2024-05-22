import { describe } from "node:test";
import { PingRoute } from "./ping.route";
import axios from "axios";

describe(`${PingRoute.method.toUpperCase()} ${PingRoute.route}`, () => {
    async function callPing() {
        return axios({
            method: PingRoute.method,
            url: PingRoute.route,
        });
    }

    it("returns http 200", async () => {
        let res = await callPing();

        expect(res.status).toBe(200);
    });
});
