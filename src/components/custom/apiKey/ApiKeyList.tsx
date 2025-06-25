"use client";

import { KeyRound } from "lucide-react";
import { ApiCredential, CopyState } from "@/types/index";
import { ApiKeyCard } from "./ApiKeyCard";

interface ApiKeyListProps {
    credentials: ApiCredential[];
    newSecret: string | null;
    newId: string | null;
    showSecret: boolean;
    copiedStates: CopyState;
    onToggleSecret: () => void;
    onDelete: (keyId: string) => void;
    onCopy: (text: string, type: "key" | "secret", credId?: string) => void;
}

export function ApiKeyList({
    credentials,
    newSecret,
    newId,
    showSecret,
    copiedStates,
    onToggleSecret,
    onDelete,
    onCopy,
}: ApiKeyListProps) {
    // Debug logging
    console.log("ApiKeyList render:", {
        credentialsCount: credentials?.length || 0,
        newId,
        newSecret: !!newSecret,
        showSecret,
        credentials: credentials?.map((c) => ({
            id: c._id,
            apiKey: c.apiKey,
            isActive: c.isActive,
        })),
    });

    // Show empty state
    if (!credentials || credentials.length === 0) {
        return (
            <div className="text-center py-8">
                <KeyRound className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                    No API keys found. Generate one below.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {credentials.map((cred) => {
                // More robust key matching
                const isNewKey = Boolean(
                    newId &&
                        (cred.apiKey === newId ||
                            cred._id === newId ||
                            cred.id === newId)
                );

                // Show the secret only for the newly created key
                const secretToShow = isNewKey && showSecret ? newSecret : null;

                // Debug logging for each credential
                console.log("Rendering credential:", {
                    credId: cred._id,
                    credApiKey: cred.apiKey,
                    newId,
                    isNewKey,
                    secretToShow: !!secretToShow,
                });

                return (
                    <ApiKeyCard
                        key={cred._id || cred.id || cred.apiKey}
                        credential={cred}
                        isNewKey={isNewKey}
                        newSecret={secretToShow}
                        showSecret={!!secretToShow}
                        copiedStates={copiedStates}
                        onToggleSecret={onToggleSecret}
                        onDelete={onDelete}
                        onCopy={onCopy}
                    />
                );
            })}
        </div>
    );
}
