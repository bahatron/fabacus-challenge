const DEV_MODE = process.env.NODE_ENV !== "production";

const LOG_CONFIG = {
    out_file: "/dev/null",
    error_file: "/dev/null",
};

const WATCH_CONFIG = {
    watch: DEV_MODE && ["dist"],
    kill_timeout: 2500,
};

module.exports = {
    apps: [
        {
            name: "tsc-compiler",
            script: "npm",
            args: ["run", "build:watch"],
            ...LOG_CONFIG,
        },
        {
            name: "api",
            script: "dist/index.js",
            exec_mode: "cluster",
            instances: DEV_MODE ? "2" : "max",
            ...LOG_CONFIG,
            ...WATCH_CONFIG,
        },
        // {
        //     name: "tests",
        //     script: "npm",
        //     args: ["run", "test:watch"],
        //     ...LOG_CONFIG,
        // },
    ],
};
