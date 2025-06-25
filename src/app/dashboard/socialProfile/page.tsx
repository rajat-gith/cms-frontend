// app/social-profiles/page.tsx
"use client";

import React from "react";
import { SocialProfileList } from "@/components/custom/socialProfile/SocialProfileList";

export default function SocialProfilePage() {
    return (
        <main className="max-w-7xl mx-auto px-4 py-8">
            <SocialProfileList />
        </main>
    );
}
