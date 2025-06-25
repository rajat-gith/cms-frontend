// components/social-profile/SocialProfileForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Globe,
    Mail,
    Phone,
    Linkedin,
    Twitter,
    Github,
    Youtube,
    Instagram,
    Facebook,
    FileText,
    Code,
    Plus,
} from "lucide-react";
import type {
    SocialProfile,
    SocialProfileFormData,
} from "@/types/socialProfile.types";

interface SocialProfileFormProps {
    profile?: SocialProfile;
    onSubmit: (data: SocialProfileFormData) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
}

const platformConfig = [
    {
        key: "email" as const,
        label: "Email",
        icon: Mail,
        type: "email",
        isContact: true,
    },
    {
        key: "phone" as const,
        label: "Phone",
        icon: Phone,
        type: "tel",
        isContact: true,
    },
    {
        key: "linkedin" as const,
        label: "LinkedIn",
        icon: Linkedin,
        type: "url",
    },
    { key: "twitter" as const, label: "Twitter", icon: Twitter, type: "url" },
    { key: "github" as const, label: "GitHub", icon: Github, type: "url" },
    { key: "website" as const, label: "Website", icon: Globe, type: "url" },
    { key: "youtube" as const, label: "YouTube", icon: Youtube, type: "url" },
    {
        key: "instagram" as const,
        label: "Instagram",
        icon: Instagram,
        type: "url",
    },
    {
        key: "facebook" as const,
        label: "Facebook",
        icon: Facebook,
        type: "url",
    },
    { key: "medium" as const, label: "Medium", icon: FileText, type: "url" },
    { key: "devto" as const, label: "Dev.to", icon: Code, type: "url" },
];

export function SocialProfileForm({
    profile,
    onSubmit,
    onCancel,
    loading = false,
}: SocialProfileFormProps) {
    const [formData, setFormData] = useState<SocialProfileFormData>({
        isPublic: true,
        socials: {},
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                isPublic: profile.isPublic,
                socials: { ...profile.socials },
            });
        }
    }, [profile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await onSubmit(formData);
    };

    const updateSocial = (platform: string, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            socials: {
                ...prev.socials,
                [platform]:
                    field === "direct"
                        ? value
                        : {
                              ...((prev.socials as any)[platform] || {}),
                              [field]: value,
                          },
            },
        }));
    };

    const updateOther = (
        field: "platform" | "url" | "username",
        value: string
    ) => {
        setFormData((prev) => ({
            ...prev,
            socials: {
                ...prev.socials,
                other: {
                    ...prev.socials.other,
                    [field]: value,
                },
            },
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Visibility Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">
                        Visibility Settings
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="isPublic">
                                Make Profile Public
                            </Label>
                            <div className="text-sm text-muted-foreground">
                                Allow others to view your social profile
                            </div>
                        </div>
                        <Switch
                            id="isPublic"
                            checked={formData.isPublic}
                            onCheckedChange={(checked) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    isPublic: checked,
                                }))
                            }
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Contact Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {platformConfig
                        .filter((p) => p.isContact)
                        .map(({ key, label, icon: Icon, type }) => (
                            <div key={key} className="space-y-2">
                                <Label
                                    htmlFor={key}
                                    className="flex items-center gap-2"
                                >
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Label>
                                <Input
                                    id={key}
                                    type={type}
                                    placeholder={`Enter your ${label.toLowerCase()}`}
                                    value={(formData.socials as any)[key] || ""}
                                    onChange={(e) =>
                                        updateSocial(
                                            key,
                                            "direct",
                                            e.target.value
                                        )
                                    }
                                />
                            </div>
                        ))}
                </CardContent>
            </Card>

            {/* Social Platforms */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Globe className="h-5 w-5" />
                        Social Platforms
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {platformConfig
                        .filter((p) => !p.isContact)
                        .map(({ key, label, icon: Icon }) => (
                            <div key={key} className="space-y-3">
                                <Label className="flex items-center gap-2 text-base font-medium">
                                    <Icon className="h-4 w-4" />
                                    {label}
                                </Label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-6">
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor={`${key}-url`}
                                            className="text-sm text-muted-foreground"
                                        >
                                            Profile URL
                                        </Label>
                                        <Input
                                            id={`${key}-url`}
                                            type="url"
                                            placeholder={`https://${key === "devto" ? "dev.to" : key}.com/username`}
                                            value={
                                                (
                                                    (formData.socials as any)[
                                                        key
                                                    ] as any
                                                )?.url || ""
                                            }
                                            onChange={(e) =>
                                                updateSocial(
                                                    key,
                                                    "url",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label
                                            htmlFor={`${key}-username`}
                                            className="text-sm text-muted-foreground"
                                        >
                                            Username
                                        </Label>
                                        <Input
                                            id={`${key}-username`}
                                            placeholder="@username"
                                            value={
                                                (
                                                    (formData.socials as any)[
                                                        key
                                                    ] as any
                                                )?.username || ""
                                            }
                                            onChange={(e) =>
                                                updateSocial(
                                                    key,
                                                    "username",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                </CardContent>
            </Card>

            {/* Custom Platform */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Plus className="h-5 w-5" />
                        Custom Platform
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="other-platform">Platform Name</Label>
                        <Input
                            id="other-platform"
                            placeholder="e.g., Behance, Dribbble, etc."
                            value={formData.socials.other?.platform || ""}
                            onChange={(e) =>
                                updateOther("platform", e.target.value)
                            }
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="other-url">Profile URL</Label>
                            <Input
                                id="other-url"
                                type="url"
                                placeholder="https://platform.com/username"
                                value={formData.socials.other?.url || ""}
                                onChange={(e) =>
                                    updateOther("url", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="other-username">Username</Label>
                            <Input
                                id="other-username"
                                placeholder="@username"
                                value={formData.socials.other?.username || ""}
                                onChange={(e) =>
                                    updateOther("username", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onCancel}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                    {loading
                        ? "Saving..."
                        : profile
                          ? "Update Profile"
                          : "Create Profile"}
                </Button>
            </div>
        </form>
    );
}
