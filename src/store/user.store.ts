import { create } from "zustand";

type User = {
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
	user: User | null;
	setUser: (user: Partial<User>) => void;
	clearUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
	user: null,

	setUser: (user) =>
		set((state) => ({
			user: {
				...state.user,
				...user,
			},
		})),

	clearUser: () =>
		set({
			user: null,
		}),
}));
