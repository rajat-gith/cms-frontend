export interface User {
	id: string;
	name: string;
	email: string;
	password?: string;
}

export type SocialLink = {
	platform: string;
	url: string;
};

export type Location = {
	country?: string;
	state?: string;
	city?: string;
};

export type ApiCredential = {
	_id: string;
	apiKey: string;
	apiSecret: string;
};

// types/socialProfile.ts

export interface SocialSub {
	url?: string;
	username?: string;
}

export interface SocialOther {
	platform?: string;
	url?: string;
	username?: string;
}

export interface Socials {
	email?: string;
	phone?: string;
	linkedin?: SocialSub;
	twitter?: SocialSub;
	github?: SocialSub;
	website?: SocialSub;
	youtube?: SocialSub;
	instagram?: SocialSub;
	facebook?: SocialSub;
	medium?: SocialSub;
	devto?: SocialSub;
	other?: SocialOther;
}

export interface SocialProfile {
	_id?: string; // MongoDB ObjectId as string
	// Ref to User ObjectId as string
	isPublic?: boolean;
	socials?: Socials;
}

export type UserProfile = {
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	username: string;
	linkedinURL?: string;
	githubURL?: string;
	otherLinks?: SocialLink[];
	isProfileComplete: boolean;
	about?: string;
	profilePhoto?: string;
	email: string;
	googleId?: string;
	location?: Location;
	phone?: string;
	role: "user" | "admin";
	apiCredentials?: ApiCredential[];
	isAuthenticated: string;
};

export interface CountryOption {
	isoCode: string;
	name: string;
}

export interface StateOption {
	isoCode: string;
	name: string;
}

export interface CityOption {
	name: string;
}

export interface ProfileFormProps {
	user: any;
	loading: boolean;
	error: Error | null;
	updateProfile: (data: any) => Promise<void>;
}

export interface ProfileDisplayProps {
	user: any;
	onEdit: () => void;
}

export interface ProfileEditModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	user: any;
	onSave: (data: any) => Promise<void>;
	countries: CountryOption[];
}

export interface LocationSelectProps {
	form: any;
	name: string;
	label: string;
	options: any[];
	onValueChange: (value: string) => void;
	disabled?: boolean;
	placeholder?: string;
}

export type Experience = {
	
	title: string;
	company: string;
	location?: string;
	employmentType:
		| "Full-time"
		| "Part-time"
		| "Internship"
		| "Contract"
		| "Freelance"
		| "Self-employed";
	period: {
		startDate: string;
		endDate?: string;
		ongoing?: boolean;
	};
	description?: string;
	technologiesUsed?: string[];
};

export type Skill = {
		name: string;
	level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
	category?: string;
};

export type TeamMember = {
	name: string;
	linkedinURL?: string;
	twitterURL?: string;
	otherLinks?: {
		platform: string;
		url: string;
	}[];
};

export type Language = {
	
	name: string;
	proficiency?: "Basic" | "Conversational" | "Fluent" | "Native";
	certification?: string;
};

export type Volunteering = {
	
	role: string;
	organization: string;
	cause?: string;
	period?: {
		startDate?: string;
		endDate?: string;
		isOngoing?: boolean;
	};
	description?: string;
	location?: string;
	website?: string;
};

export type Project = {
	
	title: string;
	description?: string;
	technologies?: string[];
	role?: string;
	teamSize?: number;
	projectType?: "individual" | "group";
	teamMembers?: TeamMember[];
	otherLinks?: string;
	repositoryLink?: string;
	liveDemoLink?: string;
	achievements?: string[];
	duration: {
		startDate: string;
		endDate?: string;
		isOngoing?: boolean;
	};
};

export type AwardHonor = {
	
	title: string;
	issuer?: string;
	dateReceived?: string;
	description?: string;
	certificateLink?: string;
	category?: string;
	location?: string;
};

export type Extracurricular = {
	
	title: string;
	description?: string;
	organization?: string;
	period?: {
		startDate?: string;
		endDate?: string;
		isOngoing?: boolean;
	};
	location?: string;
	mediaLink?: string;
};

export type Interest = {
	
	title: string;
	description?: string;
	category?: string;
	icon?: string;
};

export type Education = {
    _id: Key | null | undefined;
	courseName: string;
	institute: string;
	degree: string;
	periodOfCourse: {
		startDate: string;
		endDate?: string;
		isOngoing?: boolean;
	};
	skills?: string[];
	courseworks?: string[];
	grades: {
		type: "cgpa" | "percentage";
		value: number;
	};
};

export type Blog = {
		title: string;
	content: string;
	tags?: string[];
	author: {
		name: string;
	};
	coverImage?: string;
	isPublished?: boolean;
	publishedAt?: string;
};

export type Certification = {
		name: string;
	issuingOrganization: string;
	issueDate: string;
	expirationDate?: string;
	isExpired?: boolean;
	credentialId?: string;
	credentialURL?: string;
	category?: string;
	skills?: string[];
};
