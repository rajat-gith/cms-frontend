import { create } from "zustand";
import {
    Skill,
    Education,
    Blog,
    Certification,
    Experience,
    Project,
    SocialProfile,
    UserProfile,
    ApiCredential,
} from "@/types";

import {
    AwardHonor,
    Extracurricular,
    Interest,
    Language,
    Volunteering,
} from "@/types/extra-module.type";

type UserStore = {
    userProfile: UserProfile | null;
    isAuthenticated: boolean;
    setUserProfile: (user: Partial<UserProfile>) => void;
    clearUserProfile: () => void;
    setIsAuthenticated: (status: boolean) => void;
    setApiCredentials: (creds: ApiCredential[]) => void;
    addApiCredential: (cred: ApiCredential) => void;
    removeApiCredential: (id: string) => void;
};
export type UserModules = {
    skills: Skill[];
    education: Education[];
    blogs: Blog[];
    certification: Certification[];
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
            const apiCredentials = Array.isArray(user.apiCredentials)
                ? user.apiCredentials
                : [];

            const updatedProfile = {
                ...(state.userProfile ?? {}),
                ...user,
                location: {
                    ...(state.userProfile?.location ?? {}),
                    ...(user.location ?? {}),
                },
                apiCredentials,
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

    setIsAuthenticated: (status) => set({ isAuthenticated: status }),

    setApiCredentials: (creds: ApiCredential[]) =>
        set((state) => ({
            userProfile: {
                ...(state.userProfile ?? {}),
                apiCredentials: creds,
            } as UserProfile,
        })),

    addApiCredential: (cred: ApiCredential) =>
        set((state) => ({
            userProfile: {
                ...(state.userProfile ?? {}),
                apiCredentials: [
                    ...(state.userProfile?.apiCredentials ?? []),
                    cred,
                ],
            } as UserProfile,
        })),

    removeApiCredential: (credId: string) =>
        set((state) => ({
            userProfile: {
                ...(state.userProfile ?? {}),
                apiCredentials: (
                    state.userProfile?.apiCredentials ?? []
                ).filter((c) => c._id !== credId),
            } as UserProfile,
        })),
}));

export const useUserModuleStore = create<UserModuleStore>((set) => ({
    modules: {
        skills: [],
        education: [],
        blogs: [],
        certification: [],
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
