import { JsonSchema } from "@bahatron/utils/lib/json-schema";
import { RequestHandler } from "express";

export interface Route {
    method: "post" | "get" | "put" | "patch" | "delete";
    route: string;
    handler: RequestHandler | RequestHandler[];
    docs?: {
        tags?: string[];
        description?: string;
        security?: Record<"v1Session", []>[];
        parameters?: {
            in: "path" | "query" | "header";
            name: string;
            required?: true;
            type?: "string" | "number";
            schema?: JsonSchema;
            description?: string;
        }[];
        requestBody?: {
            required?: boolean;
            schema: JsonSchema;
        };
        responses?: {
            [k: number]: {
                description?: string;
                schema: JsonSchema;
            };
        };
        schemas?: {
            [k: string]: JsonSchema;
        };
    };
}

const _proto = {};

export function Route(route: Route): Route {
    return Object.setPrototypeOf(route, _proto);
}

Route.isRoute = (obj): obj is Route => {
    return Object.getPrototypeOf(obj) === _proto;
};
