"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Home() {
    const router = useRouter();
    const handleGetStartedButton = () => {
        router.replace("/auth/login");
    };

    return (
        <div className="min-h-screen bg-white text-black flex flex-col items-center px-6 py-20 space-y-24">
            <section className="text-center space-y-6 max-w-3xl">
                <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-tight">
                    Your Portfolio CMS, Simplified
                </h1>
                <p className="text-gray-600 text-lg md:text-xl">
                    Manage everything — projects, education, skills — in one
                    elegant dashboard.
                </p>
                <Button
                    size="lg"
                    onClick={handleGetStartedButton}
                    className="bg-black text-white hover:bg-gray-800 transition-colors cursor-pointer"
                >
                    Get Started
                </Button>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                <Card className="bg-gray-100 border border-gray-200 shadow-sm">
                    <CardHeader>
                        <LayoutDashboard className="h-8 w-8 text-black" />
                        <CardTitle className="text-black">
                            Unified Dashboard
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Easily access and update all your CMS modules from
                            one place.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gray-100 border border-gray-200 shadow-sm">
                    <CardHeader>
                        <ShieldCheck className="h-8 w-8 text-black" />
                        <CardTitle className="text-black">
                            Secure Auth
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Protect your data with a secure login and token
                            system.
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-gray-100 border border-gray-200 shadow-sm">
                    <CardHeader>
                        <Sparkles className="h-8 w-8 text-black" />
                        <CardTitle className="text-black">
                            Modular Features
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-gray-600">
                            Education, blogs, certifications, interests — manage
                            it all your way.
                        </p>
                    </CardContent>
                </Card>
            </section>
        </div>
    );
}
