"use client";

import { ExtraModuleList } from "@/components/custom/extra/ExtraModuleList";
import { extraModulesConfig } from "@/lib/extra-modules-config";
import type { ExtraModuleType } from "@/types/extra-module.type";
import { notFound } from "next/navigation";

interface PageProps {
    params: Promise<{
        type: string;
    }>;
}

export default async function ExtraModuleTypePage({ params }: PageProps) {
    const { type } = await params;
    const moduleType = type as ExtraModuleType;

    if (!extraModulesConfig[moduleType]) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <ExtraModuleList type={moduleType} />
        </div>
    );
}
