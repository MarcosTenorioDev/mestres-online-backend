import { z } from "zod";

const envSchema = z.object({
	PORT: z.string().default("3000"),
	DATABASE_URL: z.string().url(),
	WEBHOOK_SECRET: z.string(),
	JWT_PUBLIC_KEY: z.string().url(),
	AWS_BUCKET_NAME: z.string(),
	AWS_BUCKET_REGION: z.string(),
	AWS_ACCESS_KEY: z.string(),
	AWS_SECRET_KEY: z.string(),
	STRIPE_ENDPOINT_SECRET: z.string(),
	STRIPE_SECRET_KEY: z.string(),
	PRODUCT_ID_BASIC_MONTHLY: z.string(),
	PRODUCT_ID_PROFESSIONAL_MONTHLY: z.string(),
	PRODUCT_ID_BASIC_YEARLY: z.string(),
	PRODUCT_ID_PROFESSIONAL_YEARLY: z.string(),
});

export const env = envSchema.parse(process.env);
