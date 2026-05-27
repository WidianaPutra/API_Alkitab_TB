import z from "zod";
import dotenv from "dotenv";
dotenv?.config();

const envSchema = z.object({
  PORT: z.number().positive().default(3000).optional(),
  DATABASE_URL: z.string(
    "DATABASE_URL is required variable in the .env file and DATABSE_URL must be string",
  ),
  NODE_ENV: z
    .enum(["DEVELOPMENT", "PRODUCTION", "TEST"])
    .default("DEVELOPMENT"),
});

const env = envSchema.parse(process.env);
console.log(env);

export { env };
