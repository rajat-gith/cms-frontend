// app/dashboard/skills/page.tsx
"use client";

import { useEffect } from "react";
import { useUserModuleStore } from "@/store/user.store";
import { useUserModules } from "@/hooks/useUserModules";
import { SkillsList } from "@/components/custom/skill/SkillList";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkillsPage() {
    const { modules } = useUserModuleStore();
    const skills = modules.skills;
    const { fetchModule, loading, error } = useUserModules();

    useEffect(() => {
        fetchModule("skills");
    }, []);

    const handleRetry = () => {
        fetchModule("skills");
    };

    if (loading && (!skills || skills.length === 0)) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Header Skeleton */}
                    <div className="flex justify-between items-start">
                        <div>
                            <Skeleton className="h-8 w-32 mb-2" />
                            <Skeleton className="h-4 w-64" />
                        </div>
                        <Skeleton className="h-10 w-28" />
                    </div>

                    {/* Stats Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="text-center">
                                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </div>
                        ))}
                    </div>

                    {/* Search and Filter Skeleton */}
                    <div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border rounded-lg">
                        <Skeleton className="h-10 flex-1" />
                        <div className="flex gap-2">
                            <Skeleton className="h-10 w-32" />
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="border rounded-lg p-4">
                                <Skeleton className="h-6 w-3/4 mb-3" />
                                <div className="flex gap-2 mb-3">
                                    <Skeleton className="h-6 w-20" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                                <Skeleton className="h-2 w-full mb-3" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <Alert variant="destructive" className="mb-6">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>Failed to load skills. Please try again.</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRetry}
                            disabled={loading}
                            className="cursor-pointer ml-4"
                        >
                            <RefreshCw
                                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
                            />
                            Retry
                        </Button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SkillsList skills={skills || []} />
        </div>
    );
}
