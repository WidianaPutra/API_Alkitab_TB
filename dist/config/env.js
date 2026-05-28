"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default?.config();
const envSchema = zod_1.default.object({
    PORT: zod_1.default.number().positive().default(3000).optional(),
    DATABASE_URL: zod_1.default.string("DATABASE_URL is required variable in the .env file and DATABSE_URL must be string"),
    NODE_ENV: zod_1.default
        .enum(["DEVELOPMENT", "PRODUCTION", "TEST"])
        .default("DEVELOPMENT"),
});
const env = envSchema.parse(process.env);
exports.env = env;
console.log(env);
