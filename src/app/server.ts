import "express-async-errors";
import express, { ErrorRequestHandler, RequestHandler, Router } from "express";
import { Route } from "./route";
import { JsonSchema } from "@bahatron/utils/lib/json-schema";
import { Log } from "../services/logger";
import swaggerUi from "swagger-ui-express";
import { glob } from "glob";

export interface SwaggerConfig {
    enabled?: boolean;
    path?: string;
    info?: {
        title?: string;
        description?: string;
        version?: string;
    };
    securitySchemes?: Record<
        string,
        {
            in: "header";
            name: string;
            type: "apiKey";
        }
    >;
}

export async function AppServer({
    routes,
    preRouteMiddleware,
    postRouteMiddleware,
    swagger,
}: {
    preRouteMiddleware: (RequestHandler | [string, RequestHandler])[];
    routes: string | Route[];
    postRouteMiddleware: (RequestHandler | ErrorRequestHandler)[];
    swagger?: SwaggerConfig;
}) {
    const app = express();

    app.use((req, res, next) => {
        res.removeHeader("x-powered-by");
        return next();
    });

    app.use(
        express.json({
            verify: (req, res, buffer) => {
                (req as any).raw = buffer;
            },
        })
    );

    preRouteMiddleware.forEach((middleware) => {
        Array.isArray(middleware)
            ? app.use(...middleware)
            : app.use(middleware);
    });

    let parsedRoutes = Array.isArray(routes) ? routes : await getRoutes(routes);

    let router = Router();

    for (let route of parsedRoutes) {
        router[route.method](route.route, route.handler);

        Log.debug(
            `registered route: ${route.method.toUpperCase()} ${route.route}`
        );
    }

    if (swagger?.enabled) {
        let path = swagger.path ?? "/docs";

        let swaggerDocs = createSwaggerDocs({
            routes: parsedRoutes,
            ...swagger,
        });

        router.get(`${path}/openapi.json`, (req, res) => res.json(swaggerDocs));
        router.use(`${path}`, swaggerUi.serve);
        router.get(`${path}`, swaggerUi.setup(swaggerDocs));
    }

    app.use(router);

    app.use(postRouteMiddleware);

    return app;
}

async function getRoutes(routesPath: string) {
    let fileNames = await glob(routesPath, { nodir: true });

    let routes: Route[] = [];
    fileNames.forEach((fileName) => {
        try {
            let route = require(fileName);

            Object.entries(route).forEach(([name, route]) => {
                if (Route.isRoute(route)) {
                    routes.push(route);
                }
            });
        } catch (err: any) {
            // ignore
        }
    });

    return routes;
}

function createSwaggerDocs({
    routes,
    info,
    securitySchemes,
}: SwaggerConfig & {
    routes: Route[];
}) {
    return {
        openapi: "3.0.0",

        info,

        servers: [
            {
                url: "/",
            },
        ],

        paths: toSwaggerPaths(routes),

        components: {
            securitySchemes,

            schemas: parseSchemas(routes),
        },
    };
}

function toSwaggerPaths(routes: Route[]) {
    return routes.reduce((carry, route) => {
        let path = route.route
            .split("/")
            .map((bit) => (bit.startsWith(":") ? `{${bit.slice(1)}}` : bit))
            .join("/");

        if (!carry[path]) {
            carry[path] = {} as any;
        }

        carry[path][route.method] = parseSwaggerRoute(route.docs);

        return carry;
    }, {} as Record<string, Record<Route["method"], any>>);
}

function parseSwaggerRoute(docs: Route["docs"]) {
    return {
        ...docs,
        requestBody: docs?.requestBody && {
            required: docs.requestBody.required,
            content: {
                "application/json": {
                    schema: docs.requestBody.schema,
                },
            },
        },
        responses:
            docs?.responses &&
            Object.entries(docs?.responses).reduce((carry, [status, doc]) => {
                carry[status as any] = {
                    description: doc.description,
                    content: {
                        "application/json": {
                            schema: doc.schema,
                        },
                    },
                };
                return carry;
            }, {} as Record<number, any>),
    };
}

function parseSchemas(routes: Route[]) {
    return routes.reduce((partial, route) => {
        return {
            ...partial,
            ...route.docs?.schemas,
        };
    }, {} as Record<string, JsonSchema>);
}
