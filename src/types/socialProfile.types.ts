// types/socialProfile.types.ts
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
