// File: lib/extra-modules-config.ts
import { Award, Heart, Languages, Users, Trophy } from "lucide-react";
import type { ExtraModuleType } from "@/types/extra-module.type";

export const extraModulesConfig = {
	language: {
		title: "Languages",
		description: "Manage your language skills and proficiency levels",
		icon: Languages,
		color: "bg-blue-500",
		fields: [
			{
				name: "name",
				label: "Language Name",
				type: "text",
				required: true,
			},
			{
				name: "proficiency",
				label: "Proficiency Level",
				type: "select",
				required: true,
				options: ["Basic", "Conversational", "Fluent", "Native"],
			},
			{ name: "certification", label: "Certification", type: "text" },
		],
	},
	extracurricular: {
		title: "Extracurricular Activities",
		description: "Track your extracurricular activities and involvement",
		icon: Users,
		color: "bg-green-500",
		fields: [
			{
				name: "title",
				label: "Activity Title",
				type: "text",
				required: true,
			},
			{ name: "organization", label: "Organization", type: "text" },
			{ name: "position", label: "Position/Role", type: "text" },
			{ name: "period.startDate", label: "Start Date", type: "date" },
			{ name: "period.endDate", label: "End Date", type: "date" },
			{
				name: "period.isOngoing",
				label: "Currently Active",
				type: "checkbox",
			},
			{ name: "description", label: "Description", type: "textarea" },
			{ name: "location", label: "Location", type: "text" },
		],
	},
	volunteering: {
		title: "Volunteering Experience",
		description: "Document your volunteer work and community service",
		icon: Heart,
		color: "bg-red-500",
		fields: [
			{ name: "role", label: "Role", type: "text", required: true },
			{
				name: "organization",
				label: "Organization",
				type: "text",
				required: true,
			},
			{ name: "cause", label: "Cause/Mission", type: "text" },
			{ name: "period.startDate", label: "Start Date", type: "date" },
			{ name: "period.endDate", label: "End Date", type: "date" },
			{
				name: "period.isOngoing",
				label: "Currently Volunteering",
				type: "checkbox",
			},
			{ name: "description", label: "Description", type: "textarea" },
			{ name: "location", label: "Location", type: "text" },
			{ name: "website", label: "Organization Website", type: "url" },
		],
	},
	interest: {
		title: "Interests & Hobbies",
		description: "Showcase your personal interests and hobbies",
		icon: Award,
		color: "bg-purple-500",
		fields: [
			{
				name: "title",
				label: "Interest/Hobby",
				type: "text",
				required: true,
			},
			{ name: "description", label: "Description", type: "textarea" },
			{ name: "category", label: "Category", type: "text" },
			{ name: "icon", label: "Icon (optional)", type: "text" },
		],
	},
	"award-honor": {
		title: "Awards & Honors",
		description: "Display your achievements and recognitions",
		icon: Trophy,
		color: "bg-yellow-500",
		fields: [
			{
				name: "title",
				label: "Award/Honor Title",
				type: "text",
				required: true,
			},
			{ name: "issuer", label: "Issuing Organization", type: "text" },
			{ name: "dateReceived", label: "Date Received", type: "date" },
			{ name: "description", label: "Description", type: "textarea" },
			{ name: "certificateLink", label: "Certificate Link", type: "url" },
			{ name: "category", label: "Category", type: "text" },
			{ name: "location", label: "Location", type: "text" },
		],
	},
} as const;

export const getModuleConfig = (type: ExtraModuleType) =>
	extraModulesConfig[type];

export const proficiencyLevels = [
	{ value: "Basic", label: "Basic" },
	{ value: "Conversational", label: "Conversational" },
	{ value: "Fluent", label: "Fluent" },
	{ value: "Native", label: "Native" },
];

export const interestCategories = [
	"Technology",
	"Sports",
	"Arts",
	"Music",
	"Reading",
	"Travel",
	"Cooking",
	"Photography",
	"Gaming",
	"Fitness",
	"Nature",
	"Other",
];

export const awardCategories = [
	"Academic",
	"Professional",
	"Sports",
	"Community Service",
	"Leadership",
	"Innovation",
	"Arts",
	"Other",
];
