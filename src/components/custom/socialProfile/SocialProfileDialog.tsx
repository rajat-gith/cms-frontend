// components/social-profile/SocialProfileDialog.tsx
"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { SocialProfileForm } from "./SocialProfileForm";
import type {
    SocialProfile,
    SocialProfileFormData,
} from "@/types/socialProfile.types";

interface SocialProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    profile?: SocialProfile;
    onSubmit: (data: SocialProfileFormData) => Promise<void>;
    loading?: boolean;
}

export function SocialProfileDialog({
    open,
    onOpenChange,
    profile,
    onSubmit,
    loading = false,
}: SocialProfileDialogProps) {
    const handleSubmit = async (data: SocialProfileFormData) => {
        await onSubmit(data);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full sm:max-w-4xl max-w-md max-h-[90vh] overflow-y-auto p-4 break-words">
                <DialogHeader>
                    <DialogTitle className="text-lg sm:text-xl font-semibold">
                        {profile
                            ? "Edit Social Profile"
                            : "Create New Social Profile"}
                    </DialogTitle>
                </DialogHeader>

                <SocialProfileForm
                    profile={profile}
                    onSubmit={handleSubmit}
                    onCancel={() => onOpenChange(false)}
                    loading={loading}
                />
            </DialogContent>
        </Dialog>
    );
}
