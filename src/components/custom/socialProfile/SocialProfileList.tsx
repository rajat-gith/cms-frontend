// components/social-profile/SocialProfileList.tsx
"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SocialProfileCard } from "./SocialProfileCard";
import { SocialProfileDialog } from "./SocialProfileDialog";
import { useSocialProfile } from "@/hooks/useSocialProfile";
import { Plus, Search, Users, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type {
    SocialProfile,
    SocialProfileFormData,
} from "@/types/socialProfile.types";

export function SocialProfileList() {
    const {
        socialProfiles,
        createSocialProfile,
        updateSocialProfile,
        deleteSocialProfile,
        loading,
        error,
    } = useSocialProfile();

    const [searchTerm, setSearchTerm] = useState("");
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<
        SocialProfile | undefined
    >();
    const [filter, setFilter] = useState<"all" | "public" | "private">("all");

    // Filter profiles based on search term and visibility filter
    const filteredProfiles =
        socialProfiles?.filter((profile) => {
            const matchesSearch =
                searchTerm === "" ||
                Object.entries(profile.socials).some(([platform, data]) => {
                    if (platform === "email" || platform === "phone") {
                        return (data as string)
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase());
                    }
                    if (platform === "other") {
                        return (data as any)?.platform
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase());
                    }
                    return (
                        platform
                            .toLowerCase()
                            .includes(searchTerm.toLowerCase()) ||
                        (data as any)?.username
                            ?.toLowerCase()
                            .includes(searchTerm.toLowerCase())
                    );
                });

            const matchesFilter =
                filter === "all" ||
                (filter === "public" && profile.isPublic) ||
                (filter === "private" && !profile.isPublic);

            return matchesSearch && matchesFilter;
        }) || [];

    const handleCreate = () => {
        setEditingProfile(undefined);
        setDialogOpen(true);
    };

    const handleEdit = (profile: SocialProfile) => {
        setEditingProfile(profile);
        setDialogOpen(true);
    };

    const handleSubmit = async (data: SocialProfileFormData) => {
        try {
            if (editingProfile) {
                await updateSocialProfile(editingProfile._id, data);
                toast.success("Social profile updated successfully");
            } else {
                await createSocialProfile(data);
                toast.success("Social profile created successfully");
            }
        } catch (error) {
            toast.error(
                editingProfile
                    ? "Failed to update profile"
                    : "Failed to create profile"
            );
        }
    };

    const handleDelete = async (id: string) => {
        if (
            window.confirm(
                "Are you sure you want to delete this social profile?"
            )
        ) {
            try {
                await deleteSocialProfile(id);
                toast.success("Social profile deleted successfully");
            } catch (error) {
                toast.error("Failed to delete social profile");
            }
        }
    };

    const publicCount = socialProfiles?.filter((p) => p.isPublic).length || 0;
    const privateCount = socialProfiles?.filter((p) => !p.isPublic).length || 0;

    if (error) {
        return (
            <Card>
                <CardContent className="flex items-center justify-center py-8">
                    <div className="text-center">
                        <p className="text-red-500 mb-2">
                            Error loading social profiles
                        </p>
                        <Button
                            variant="outline"
                            onClick={() => window.location.reload()}
                        >
                            Reload
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Social Profiles</h1>
                    <p className="text-muted-foreground">
                        Manage your social media presence and contact
                        information
                    </p>
                </div>
                <Button onClick={handleCreate} disabled={loading}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Profile
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Total Profiles
                                </p>
                                <p className="text-2xl font-bold">
                                    {socialProfiles?.length || 0}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Public
                                </p>
                                <p className="text-2xl font-bold text-green-500">
                                    {publicCount}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-orange-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Private
                                </p>
                                <p className="text-2xl font-bold text-orange-500">
                                    {privateCount}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                            <Search className="h-4 w-4 text-blue-500" />
                            <div>
                                <p className="text-sm text-muted-foreground">
                                    Filtered
                                </p>
                                <p className="text-2xl font-bold text-blue-500">
                                    {filteredProfiles.length}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1 min-w-0">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search profiles by platform or username..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                            <Button
                                variant={filter === "all" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("all")}
                                className="flex-1 sm:flex-none whitespace-nowrap"
                            >
                                All
                            </Button>
                            <Button
                                variant={filter === "public" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("public")}
                                className="flex-1 sm:flex-none whitespace-nowrap"
                            >
                                <Eye className="h-4 w-4 mr-1 flex-shrink-0" />
                                Public
                            </Button>
                            <Button
                                variant={filter === "private" ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter("private")}
                                className="flex-1 sm:flex-none whitespace-nowrap"
                            >
                                <EyeOff className="h-4 w-4 mr-1 flex-shrink-0" />
                                Private
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Loading State */}
            {loading && (
                <Card>
                    <CardContent className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin mr-2" />
                        Loading social profiles...
                    </CardContent>
                </Card>
            )}

            {/* Profiles Grid */}
            {!loading && (
                <>
                    {filteredProfiles.length === 0 ? (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">
                                    {searchTerm || filter !== "all"
                                        ? "No profiles found"
                                        : "No social profiles yet"}
                                </h3>
                                <p className="text-muted-foreground text-center mb-4">
                                    {searchTerm || filter !== "all"
                                        ? "Try adjusting your search or filter criteria"
                                        : "Create your first social profile to get started"}
                                </p>
                                {!searchTerm && filter === "all" && (
                                    <Button onClick={handleCreate}>
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Your First Profile
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProfiles.map((profile) => (
                                <SocialProfileCard
                                    key={profile._id}
                                    profile={profile}
                                    onEdit={() => handleEdit(profile)}
                                    onDelete={() => handleDelete(profile._id)}
                                />
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Dialog */}
            <SocialProfileDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                profile={editingProfile}
                onSubmit={handleSubmit}
            />
        </div>
    );
}
