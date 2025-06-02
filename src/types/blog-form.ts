import { z } from "zod";

export const blogFormSchema = z
	.object({
		title: z.string().min(1, "Blog title is required"),
		content: z.string().min(1, "Blog content is required"),
		tags: z.array(z.string()).optional(),
		isPublished: z.boolean().optional(),
		publishedAt: z.string().optional(),
	})
	.refine(
		(data) => {
			if (data.isPublished && !data.publishedAt) {
				return false;
			}
			return true;
		},
		{
			message: "Published date is required when blog is published",
			path: ["publishedAt"],
		}
	);

export type BlogFormData = z.infer<typeof blogFormSchema>;
