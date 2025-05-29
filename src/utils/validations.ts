import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email.");
const passwordSchema = z
	.string()
	.min(6, "Password must be at least 6 characters.");

export const signupSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export const profileSchema = z.object({
	first_name: z.string().min(1, "First name is required"),
	middle_name: z.string().optional(),
	last_name: z.string().min(1, "Last name is required"),
	username: z.string().min(1, "Username is required"),
	email: z.string().email("Please enter a valid email"),
	phone: z.string().optional(),
	location: z
		.object({
			country: z.string().optional(),
			state: z.string().optional(),
			city: z.string().optional(),
		})
		.optional(),
	linkedinURL: z
		.string()
		.url("Please enter a valid LinkedIn URL")
		.optional()
		.or(z.literal("")),
	githubURL: z
		.string()
		.url("Please enter a valid GitHub URL")
		.optional()
		.or(z.literal("")),
	about: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const validateSignup = (
	email: string,
	password: string
): string | null => {
	const result = signupSchema.safeParse({ email, password });
	return result.success ? null : result.error.errors[0].message;
};

export const validateLogin = (
	email: string,
	password: string
): string | null => {
	const result = loginSchema.safeParse({ email, password });
	return result.success ? null : result.error.errors[0].message;
};
