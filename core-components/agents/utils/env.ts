import { z } from "zod";

const envSchema = z.object({
  DEEPSEEK_API_KEY: z.string().min(1, "DEEPSEEK_API_KEY is required"),
});

export const env = envSchema.parse(process.env);
