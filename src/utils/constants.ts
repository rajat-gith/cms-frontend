import {
	Home,
	Code,
	GraduationCap,
	BookOpen,
	Briefcase,
	Star,
	Users,
	Globe,
	UserCheck,
	Target,
	FileText,
} from "lucide-react";

export const PROFILE_FORM_INITIAL_VALUES = {
	first_name: "",
	middle_name: "",
	last_name: "",
	username: "",
	email: "",
	phone: "",
	location: { country: "", state: "", city: "" },
	linkedinURL: "",
	githubURL: "",
	about: "",
};

export const SIDEBAR_MENU_ITEMS = [
	{
		label: "Getting Started",
		icon: Home,
		href: "/dashboard/generateApiKey",
	},
	{
		label: "Education",
		icon: GraduationCap,
		href: "/dashboard/education",
	},
	{
		label: "Experience",
		icon: Briefcase,
		href: "/dashboard/experience",
	},
	{
		label: "Skills",
		icon: Code,
		href: "/dashboard/skills",
	},
	{
		label: "Projects",
		icon: BookOpen,
		href: "/dashboard/projects",
	},
	{
		label: "Certifications",
		icon: Star,
		href: "/dashboard/certification",
	},
	{
		label: "Blogs",
		icon: FileText,
		href: "/dashboard/blog",
	},
	{
		label: "Social Profiles",
		icon: Users,
		href: "/dashboard/socialProfile",
	},
	{
		label: "Extras",
		icon: UserCheck,
		href: "/dashboard/extra",
		children: [
			{ label: "Awards & Honors", href: "/dashboard/extra#awards" },
			{
				label: "Extracurriculars",
				href: "/dashboard/extra#extracurricular",
			},
			{ label: "Languages", href: "/dashboard/extra#languages" },
			{ label: "Volunteering", href: "/dashboard/extra#volunteering" },
			{ label: "Interests", href: "/dashboard/extra#interests" },
		],
	},
];
