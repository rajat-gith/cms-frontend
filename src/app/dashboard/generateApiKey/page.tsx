"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { MAX_API_KEYS } from "@/utils/apiKeyUtils";
import { ApiKeyList } from "@/components/custom/apiKey/ApiKeyList";
import { useApiKeys } from "@/hooks/useApiKey";
import { useUserStore } from "@/store/user.store";

export default function ApiKeyPage() {
    const {
        userProfile,
        credentials,
        loading,
        error,
        generating,
        newSecret,
        newId,
        showSecret,
        copiedStates,
        canGenerateMore,
        handleCopy,
        handleGenerateKey,
        handleDeleteKey,
        toggleSecret,
        fetchApiCredentials,
    } = useApiKeys();

    // Fix: Always fetch on mount, regardless of userProfile state
    useEffect(() => {
        fetchApiCredentials();
    }, []); // Empty dependency array - only run on mount

    const loadingInitial =
        loading && (!credentials || credentials.length === 0);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Your API Keys</h2>
                <div className="text-sm text-muted-foreground">
                    {credentials.length}/{MAX_API_KEYS} keys used
                </div>
            </div>

            {loadingInitial ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading API keys...</span>
                </div>
            ) : error ? (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                    <p className="text-destructive">
                        Error loading profile: {error}
                    </p>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchApiCredentials}
                        className="mt-2"
                    >
                        Retry
                    </Button>
                </div>
            ) : (
                <ApiKeyList
                    credentials={credentials}
                    newSecret={newSecret}
                    newId={newId}
                    showSecret={showSecret}
                    copiedStates={copiedStates}
                    onToggleSecret={toggleSecret}
                    onDelete={handleDeleteKey}
                    onCopy={handleCopy}
                />
            )}

            <div className="flex flex-col sm:flex-row gap-4 items-start">
                <Button
                    onClick={handleGenerateKey}
                    disabled={generating || !canGenerateMore || loadingInitial}
                    className={`cursor-pointer ${
                        !canGenerateMore || loadingInitial
                            ? "cursor-not-allowed opacity-50"
                            : ""
                    }`}
                >
                    {generating ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        "Generate New API Key"
                    )}
                </Button>

                {!canGenerateMore && (
                    <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-md">
                        Maximum of {MAX_API_KEYS} API keys reached. Delete an
                        existing key to create a new one.
                    </p>
                )}
            </div>

            {/* Info section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                    API Key Usage
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>
                        • Use your API key and secret to authenticate API
                        requests
                    </li>
                    <li>
                        • Keep your secret secure and never share it publicly
                    </li>
                    <li>
                        • You can generate up to {MAX_API_KEYS} API keys maximum
                    </li>
                    <li>• Delete unused keys to maintain security</li>
                </ul>
            </div>
        </div>
    );
}
