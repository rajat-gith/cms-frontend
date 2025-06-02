import { z } from "zod";

export const experienceFormSchema = z.object({
	title: z.string().min(1, "Job title is required"),
	company: z.string().min(1, "Company name is required"),
	location: z.string().optional(),
	employmentType: z.enum([
		"Full-time",
		"Part-time",
		"Internship",
		"Contract",
		"Freelance",
		"Self-employed",
	]),
	period: z
		.object({
			startDate: z.string().min(1, "Start date is required"),
			endDate: z.string().optional(),
			ongoing: z.boolean().optional(),
		})
		.refine(
			(data) => {
				if (!data.ongoing && data.endDate && data.startDate) {
					return new Date(data.endDate) >= new Date(data.startDate);
				}
				return true;
			},
			{
				message: "End date must be after start date",
				path: ["endDate"],
			}
		),
	description: z.string().optional(),
	technologiesUsed: z.array(z.string()).optional(),
});

export const intialExperienceFormData: ExperienceFormData = {
	title: "",
	company: "",
	location: "",
	employmentType: "Full-time",
	period: {
		startDate: "",
		endDate: "",
		ongoing: false,
	},
	description: "",
	technologiesUsed: [],
};

export type ExperienceFormData = z.infer<typeof experienceFormSchema>;
