"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BadgeCheck, Edit3, UploadCloud, LayoutDashboard } from "lucide-react";

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-white px-6 py-12 space-y-12">
            {/* Welcome Section */}
            <section className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">
                    Welcome to Your CMS Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                    Manage all your profile modules — fast, easy, and secure.
                </p>
            </section>

            {/* How to Use Section */}
            <section className="max-w-5xl mx-auto">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Getting Started: 4 Easy Steps
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <LayoutDashboard className="h-6 w-6 text-black" />
                            <CardTitle>Step 1: Explore Dashboard</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Navigate through modules like Projects,
                                Education, Skills, and more.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <Edit3 className="h-6 w-6 text-black" />
                            <CardTitle>Step 2: Add Your Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Click into each module and fill out your
                                information — it's all autosaved.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <UploadCloud className="h-6 w-6 text-black" />
                            <CardTitle>Step 3: Save & Publish</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Your data is stored securely and ready to power
                                your portfolio or site.
                            </p>
                        </CardContent>
                    </Card>
                    <Card className="bg-gray-50 border-gray-200">
                        <CardHeader className="flex flex-row items-center gap-3">
                            <BadgeCheck className="h-6 w-6 text-black" />
                            <CardTitle>Step 4: Share or Integrate</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-600">
                                Use public endpoints or frontend integrations to
                                show your data wherever needed.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
