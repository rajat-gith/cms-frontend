// hooks/useSocialProfile.ts
"use client";

import { useCallback, useEffect, useState } from "react";
import { useUserModules } from "@/hooks/useUserModules";
import { useUserModuleStore } from "@/store/user.store";
import type {
    SocialProfile,
    SocialProfileFormData,
} from "@/types/socialProfile.types";

export function useSocialProfile() {
    const {
        fetchModule,
        createModuleItem,
        updateModuleItem,
        deleteModuleItem,
        loading,
        error,
    } = useUserModules();
    const { modules } = useUserModuleStore();
    const [initialized, setInitialized] = useState(false);

    const socialProfiles = modules.socialProfiles;
    // Fetch social profiles on mount
    useEffect(() => {
        if (!initialized) {
            fetchModule("socialProfiles");
            setInitialized(true);
        }
    }, [fetchModule, initialized]);

    const createSocialProfile = useCallback(
        async (data: SocialProfileFormData) => {
            return await createModuleItem("socialProfiles", data);
        },
        [createModuleItem]
    );

    const updateSocialProfile = useCallback(
        async (id: string, data: Partial<SocialProfileFormData>) => {
            return await updateModuleItem("socialProfiles", id, data);
        },
        [updateModuleItem]
    );

    const deleteSocialProfile = useCallback(
        async (id: string) => {
            return await deleteModuleItem("socialProfiles", id);
        },
        [deleteModuleItem]
    );

    const refreshSocialProfiles = useCallback(() => {
        return fetchModule("socialProfiles");
    }, [fetchModule]);

    return {
        socialProfiles: socialProfiles as SocialProfile[],
        createSocialProfile,
        updateSocialProfile,
        deleteSocialProfile,
        refreshSocialProfiles,
        loading,
        error,
    };
}
