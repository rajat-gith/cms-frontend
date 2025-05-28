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

export type UserProfile = {
	first_name: string;
	middle_name?: string;
	last_name: string;
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
};
