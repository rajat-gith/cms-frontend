import { create } from "zustand";
import {
	Skill,
	Education,
	Blog,
	Certification,
	Experience,
	AwardHonor,
	Extracurricular,
	Interest,
	Language,
	Volunteering,
	Project,
	SocialProfile,
	UserProfile,
} from "@/types";

type UserStore = {
	userProfile: UserProfile | null;
	isAuthenticated: boolean;
	setUserProfile: (user: Partial<UserProfile>) => void;
	clearUserProfile: () => void;
	setIsAuthenticated: (status: boolean) => void;
};
export type UserModules = {
	skills: Skill[];
	education: Education[];
	blogs: Blog[];
	certifications: Certification[];
	experiences: Experience[];
	awardsHonors: AwardHonor[];
	extracurriculars: Extracurricular[];
	interests: Interest[];
	languages: Language[];
	volunteering: Volunteering[];
	projects: Project[];
	socialProfiles: SocialProfile[];
};

type UserModuleStore = {
	modules: UserModules;
	setModule: <T extends keyof UserModules>(
		key: T,
		data: UserModules[T]
	) => void;
	addItem: <T extends keyof UserModules>(
		key: T,
		item: UserModules[T][number]
	) => void;
	removeItem: <T extends keyof UserModules>(key: T, id: string) => void;
};

export const useUserStore = create<UserStore>((set) => ({
	userProfile: null,
	isAuthenticated: false,

	setUserProfile: (user) =>
		set((state) => {
			const updatedProfile = {
				...(state.userProfile ?? {}),
				...user,
				location: {
					...(state.userProfile?.location ?? {}),
					...(user.location ?? {}),
				},
				apiCredentials:
					user.apiCredentials ??
					state.userProfile?.apiCredentials ??
					[],
			};

			return {
				userProfile: updatedProfile as UserProfile,
				isAuthenticated: true,
			};
		}),

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

export const useUserModuleStore = create<UserModuleStore>((set) => ({
	modules: {
		skills: [],
		education: [],
		blogs: [],
		certifications: [],
		experiences: [],
		awardsHonors: [],
		extracurriculars: [],
		interests: [],
		languages: [],
		volunteering: [],
		projects: [],
		socialProfiles: [],
	},
	setModule: (key, data) =>
		set((state) => ({
			modules: {
				...state.modules,
				[key]: data,
			},
		})),
	addItem: (key, item) =>
		set((state) => ({
			modules: {
				...state.modules,
				[key]: [...state.modules[key], item],
			},
		})),
	removeItem: (key, id) =>
		set((state) => ({
			modules: {
				...state.modules,
				[key]: state.modules[key].filter((item) => item._id !== id),
			},
		})),
}));
