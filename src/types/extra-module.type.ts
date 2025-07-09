// File: components/extra-modules/types.ts
export interface BaseExtraModule {
    _id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface AwardHonor extends BaseExtraModule {
    title: string;
    issuer?: string;
    dateReceived?: string;
    description?: string;
    certificateLink?: string;
    category?: string;
    location?: string;
}

export interface Interest extends BaseExtraModule {
    title: string;
    description?: string;
    category?: string;
    icon?: string;
}

export interface Language extends BaseExtraModule {
    name: string;
    proficiency: "Basic" | "Conversational" | "Fluent" | "Native";
    certification?: string;
}

export interface Volunteering extends BaseExtraModule {
    role: string;
    organization: string;
    cause?: string;
    period: {
        startDate?: string;
        endDate?: string;
        isOngoing: boolean;
    };
    description?: string;
    location?: string;
    website?: string;
}

export interface Extracurricular extends BaseExtraModule {
    title: string;
    organization?: string;
    position?: string;
    period: {
        startDate?: string;
        endDate?: string;
        isOngoing: boolean;
    };
    description?: string;
    location?: string;
}

export type ExtraModuleType =
    | "language"
    | "extracurricular"
    | "volunteering"
    | "interest"
    | "award-honor";

export type ExtraModuleData =
    | AwardHonor
    | Interest
    | Language
    | Volunteering
    | Extracurricular;
