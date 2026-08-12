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

export interface ApiCredential {
    _id: string;
    apiKey: string;
    apiSecret: string; // This will be empty string from API (never expose the hash)
    user: string;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

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
    _id: string;
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

export type TeamMember = {
    id?: string;
    name: string;
    linkedinURL?: string;
    twitterURL?: string;
    otherLinks?: {
        platform: string;
        url: string;
    }[];
};

export type Language = {
    _id: string;
    name: string;
    proficiency?: "Basic" | "Conversational" | "Fluent" | "Native";
    certification?: string;
};

export type Volunteering = {
    _id: string;
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

export type AwardHonor = {
    _id: string;
    title: string;
    issuer?: string;
    dateReceived?: string;
    description?: string;
    certificateLink?: string;
    category?: string;
    location?: string;
};

export type Extracurricular = {
    _id: string;
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
    _id: string;
    title: string;
    description?: string;
    category?: string;
    icon?: string;
};

export type Education = {
    _id: string;
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
    _id: string;
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

export interface CopyState {
    [key: string]: boolean;
}

export interface Certification {
    _id: string;
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    isExpired: boolean;
    credentialId?: string;
    credentialURL?: string;
    category?: string;
    skills: string[];
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CertificationFormData {
    name: string;
    issuingOrganization: string;
    issueDate: string;
    expirationDate?: string;
    credentialId?: string;
    credentialURL?: string;
    category?: string;
    skills?: string[];
}

export interface CertificationCardProps {
    certification: Certification;
    onEdit: (certification: Certification) => void;
    onDelete: (id: string) => void;
}

export interface CertificationFormProps {
    certification?: Certification;
    onSubmit: (data: CertificationFormData) => void;
    onCancel: () => void;
    loading?: boolean;
}

// types/index.ts
export interface Skill {
    _id: string;
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    category?: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
}

export interface CreateSkillData {
    name: string;
    level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
    category?: string;
}

export interface UpdateSkillData extends Partial<CreateSkillData> {}

export const SKILL_LEVELS = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
    { value: "Expert", label: "Expert" },
] as const;

export const SKILL_CATEGORIES = [
    { value: "Programming", label: "Programming" },
    { value: "Design", label: "Design" },
    { value: "Marketing", label: "Marketing" },
    { value: "Management", label: "Management" },
    { value: "Communication", label: "Communication" },
    { value: "Technical", label: "Technical" },
    { value: "Creative", label: "Creative" },
    { value: "Analytical", label: "Analytical" },
    { value: "Other", label: "Other" },
] as const;

// types/project.ts
export interface Project {
    id: string;
    userId: string;
    title: string;
    description?: string;
    technologies: string[];
    role?: string;
    teamSize?: number;
    projectType: "individual" | "group";
    teamMembers: TeamMember[];
    otherLinks?: string;
    repositoryLink?: string;
    liveDemoLink?: string;
    achievements: string[];
    duration: {
        startDate: Date;
        endDate?: Date;
        isOngoing: boolean;
    };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectFormData
    extends Omit<Project, "id" | "userId" | "createdAt" | "updatedAt"> {}

export interface ProjectFilters {
    search: string;
    projectType: string;
    technologies: string[];
    dateRange: {
        start?: Date;
        end?: Date;
    };
}

export interface SocialSubSchema {
    url?: string;
    username?: string;
}

export interface SocialProfile {
    _id: string;
    userId: string;
    isPublic: boolean;
    socials: {
        email?: string;
        phone?: string;
        linkedin?: SocialSubSchema;
        twitter?: SocialSubSchema;
        github?: SocialSubSchema;
        website?: SocialSubSchema;
        youtube?: SocialSubSchema;
        instagram?: SocialSubSchema;
        facebook?: SocialSubSchema;
        medium?: SocialSubSchema;
        devto?: SocialSubSchema;
        other?: {
            platform?: string;
            url?: string;
            username?: string;
        };
    };
    createdAt: string;
    updatedAt: string;
}

export interface SocialProfileFormData {
    isPublic: boolean;
    socials: {
        email?: string;
        phone?: string;
        linkedin?: SocialSubSchema;
        twitter?: SocialSubSchema;
        github?: SocialSubSchema;
        website?: SocialSubSchema;
        youtube?: SocialSubSchema;
        instagram?: SocialSubSchema;
        facebook?: SocialSubSchema;
        medium?: SocialSubSchema;
        devto?: SocialSubSchema;
        other?: {
            platform?: string;
            url?: string;
            username?: string;
        };
    };
}
