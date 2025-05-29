import { create } from "zustand";

type UserProfile = {
	first_name?: string;
	middle_name?: string;
	last_name?: string;
	username?: string;
	linkedinURL?: string;
	githubURL?: string;
	otherLinks?: {
		platform: string;
		url: string;
	}[];
	isProfileComplete?: boolean;
	about?: string;
	profilePhoto?: string;
	email?: string;
	googleId?: string;
	location?: {
		country?: string;
		state?: string;
		city?: string;
	};
	phone?: string;
	role?: "user" | "admin";
};

type UserStore = {
	userProfile: UserProfile | null;
	isAuthenticated: boolean;
	setUserProfile: (user: Partial<UserProfile>) => void;
	clearUserProfile: () => void;
	setIsAuthenticated: (status: boolean) => void;
};

export const useUserStore = create<UserStore>((set) => ({
	userProfile: null,
	isAuthenticated: false,

	setUserProfile: (user) =>
		set((state) => ({
			userProfile: {
				...state.userProfile,
				...user,
			},
			isAuthenticated: true,
		})),

	clearUserProfile: () =>
		set({
			userProfile: null,
			isAuthenticated: false,
		}),

	setIsAuthenticated: (status) =>
		set({
			isAuthenticated: status,
		}),
}));
