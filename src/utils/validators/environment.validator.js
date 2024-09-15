import { isValidNumber } from "./value.validator.js";

export function validateEnvVars() {
    const vars = process.env;

    if (!vars.REDIS_HOST || !vars.REDIS_PORT || !vars.REDIS_PASSWORD) {
        console.error("Redis configurations are not present! Set environment vars before running the applications.");
        process.exit(1);
    }

    if (vars.EXPIRY_MAX && !isValidNumber(vars.EXPIRY_MAX)) {
        console.error("EXPIRY_MAX value is invalid. It can only be an integer or a float.");
        process.exit(1);
    }

    if (vars.EXPIRY_MIN && !isValidNumber(vars.EXPIRY_MIN)) {
        console.error("EXPIRY_MIN value is invalid. It can only be an integer or a float.");
        process.exit(1);
    }

    if (vars.JOB_TTL && !isValidNumber(vars.JOB_TTL)) {
        console.error("JOB_TTL value is invalid. It can only be an integer or a float.");
        process.exit(1);
    }
}