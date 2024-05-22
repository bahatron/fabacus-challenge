export const Env = {
    DEBUG: process.env.DEBUG == "1",
    PORT: process.env.PORT,
    DEV_MODE: process.env.NODE_ENV !== "production",
    REDIS_URL: process.env.REDIS_URL,
};
