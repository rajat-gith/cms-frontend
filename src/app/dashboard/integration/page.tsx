// app/integration/page.tsx
"use client";

import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Copy, ExternalLink, Globe, Code } from "lucide-react";
import { PublicUrlsList } from "@/components/custom/integration/PublicUrlsList";
import { UsageGuide } from "@/components/custom/integration/UsageGuide";
import { toast } from "sonner";

export default function IntegrationPage() {
    const [selectedUrl, setSelectedUrl] = useState("");

    const availableUrls = [
        {
            entity: "education",
            description: "Get education data",
            endpoint: "/public/education",
        },
        {
            entity: "experience",
            description: "Get experience data",
            endpoint: "/public/experience",
        },
        {
            entity: "skill",
            description: "Get skill data",
            endpoint: "/public/skill",
        },
        {
            entity: "project",
            description: "Get project data",
            endpoint: "/public/project",
        },
        {
            entity: "certification",
            description: "Get certification data",
            endpoint: "/public/certification",
        },
        {
            entity: "blog",
            description: "Get blog data",
            endpoint: "/public/blog",
        },
        {
            entity: "socialProfile",
            description: "Get social profile data",
            endpoint: "/public/socialProfile",
        },
        {
            entity: "award",
            description: "Get award & honor data",
            endpoint: "/public/extra/award-honor",
        },
        {
            entity: "extracurricular",
            description: "Get extracurricular data",
            endpoint: "/public/extra/extracurricular",
        },
        {
            entity: "language",
            description: "Get language data",
            endpoint: "/public/extra/language",
        },
        {
            entity: "volunteering",
            description: "Get volunteering data",
            endpoint: "/public/extra/volunteering",
        },
        {
            entity: "interest",
            description: "Get interest data",
            endpoint: "/public/extra/interest",
        },
    ];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
    };

    const getFullUrl = (endpoint: string) => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        if (!baseUrl) {
            throw new Error(
                "Backend URL is not defined in environment variables"
            );
        }
        return `${baseUrl}${endpoint}`;
    };

    return (
        <div className="container mx-auto py-6 sm:py-8 px-4 max-w-6xl">
            <div className="mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                    Public API Integration
                </h1>
                <p className="text-muted-foreground">
                    Access your data through public URLs. Simply append your API
                    key to any endpoint below.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Available Public URLs */}
                <div className="lg:col-span-2">
                    <PublicUrlsList
                        urls={availableUrls}
                        onCopy={copyToClipboard}
                        onSelect={setSelectedUrl}
                        getFullUrl={getFullUrl}
                    />
                </div>

                {/* Usage Guide */}
                <div className="space-y-6">
                    <UsageGuide selectedUrl={selectedUrl} />

                    <Alert>
                        <Globe className="h-4 w-4" />
                        <AlertDescription>
                            All endpoints return JSON format only. Make sure to
                            include your API key in the query parameters.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        </div>
    );
}
