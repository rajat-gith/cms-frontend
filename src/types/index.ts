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
