// components/social-profile/SocialProfileCard.tsx
"use client";

import React from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, Eye, EyeOff, ExternalLink, User } from "lucide-react";
import type { SocialProfile } from "@/types/socialProfile.types";

interface SocialProfileCardProps {
    profile: SocialProfile;
    onEdit: (profile: SocialProfile) => void;
    onDelete: (id: string) => void;
}

const socialPlatformIcons: Record<string, string> = {
    linkedin: "💼",
    twitter: "🐦",
    github: "👨‍💻",
    website: "🌐",
    youtube: "📺",
    instagram: "📷",
    facebook: "👥",
    medium: "📝",
    devto: "👩‍💻",
    email: "📧",
    phone: "📱",
};

export function SocialProfileCard({
    profile,
    onEdit,
    onDelete,
}: SocialProfileCardProps) {
    const activeSocials = Object.entries(profile.socials).filter(
        ([key, value]) => {
            // Skip if value is not an object (e.g., string or null)
            if (typeof value !== "object" || value === null) return false;

            if (key === "other") {
                return value.platform && (value.url || value.username);
            }
            if (key === "email" || key === "phone") {
                return !!value;
            }
            return value.url || value.username;
        }
    );

    return (
        <Card className="w-full hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <User className="h-5 w-5" />
                        Social Profile
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Badge
                            variant={profile.isPublic ? "default" : "secondary"}
                        >
                            {profile.isPublic ? (
                                <Eye className="h-3 w-3 mr-1" />
                            ) : (
                                <EyeOff className="h-3 w-3 mr-1" />
                            )}
                            {profile.isPublic ? "Public" : "Private"}
                        </Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="pb-3">
                <div className="space-y-3">
                    <div className="text-sm text-muted-foreground">
                        Active Platforms: {activeSocials.length}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {activeSocials.slice(0, 6).map(([platform, data]) => (
                            <div
                                key={platform}
                                className="flex items-center gap-2 p-2 rounded-md bg-secondary/50"
                            >
                                <span className="text-lg">
                                    {socialPlatformIcons[platform] || "🔗"}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-medium capitalize truncate">
                                        {platform === "other"
                                            ? (data as any)?.platform
                                            : platform}
                                    </div>
                                    <div className="text-xs text-muted-foreground truncate">
                                        {platform === "email" ||
                                        platform === "phone"
                                            ? (data as string)
                                            : (data as any)?.username || "Set"}
                                    </div>
                                </div>
                                {platform !== "email" &&
                                    platform !== "phone" &&
                                    (data as any)?.url && (
                                        <ExternalLink className="h-3 w-3 text-muted-foreground" />
                                    )}
                            </div>
                        ))}
                    </div>

                    {activeSocials.length > 6 && (
                        <div className="text-xs text-muted-foreground text-center">
                            +{activeSocials.length - 6} more platforms
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="pt-3 border-t">
                <div className="flex justify-between items-center w-full">
                    <div className="text-xs text-muted-foreground">
                        Updated:{" "}
                        {new Date(profile.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(profile)}
                        >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => onDelete(profile._id)}
                        >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                        </Button>
                    </div>
                </div>
            </CardFooter>
        </Card>
    );
}
