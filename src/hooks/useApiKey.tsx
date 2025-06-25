"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import Cookies from "js-cookie";
import axios from "@/lib/axios";

import {
    copyToClipboard,
    validateApiKeyGeneration,
    MAX_API_KEYS,
} from "@/utils/apiKeyUtils";

import { ApiCredential, CopyState } from "@/types/index";
import { useUserStore } from "@/store/user.store";

export function useApiKeys() {
    const {
        userProfile,
        setApiCredentials,
        addApiCredential,
        removeApiCredential,
    } = useUserStore();

    const token = Cookies.get("token");
    const [generating, setGenerating] = useState(false);
    const [newSecret, setNewSecret] = useState<string | null>(null);
    const [newId, setNewId] = useState<string | null>(null);
    const [showSecret, setShowSecret] = useState(false);
    const [copiedStates, setCopiedStates] = useState<CopyState>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const credentials: ApiCredential[] = userProfile?.apiCredentials ?? [];
    const canGenerateMore = credentials.length < MAX_API_KEYS;

    const fetchApiCredentials = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const token = Cookies.get("token");
            const res = await axios.get("/api-credentials", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            console.log("Fetched credentials:", res.data.credentials);
            setApiCredentials(res.data.credentials);
        } catch (err: any) {
            console.error("Failed to fetch API credentials:", err);
            setError("Failed to load API credentials.");
        } finally {
            setLoading(false);
        }
    }, [setApiCredentials]);

    const handleCopy = useCallback(
        async (text: string, type: "key" | "secret", credId?: string) => {
            try {
                await navigator.clipboard.writeText(text);
                const copyId = credId ? `${credId}-${type}` : type;

                setCopiedStates((prev) => ({ ...prev, [copyId]: true }));

                toast.success(
                    `${type === "key" ? "API Key" : "Secret"} copied to clipboard!`
                );

                setTimeout(() => {
                    setCopiedStates((prev) => ({ ...prev, [copyId]: false }));
                }, 2000);
            } catch (err) {
                console.error("Failed to copy to clipboard:", err);
                toast.error("Failed to copy to clipboard");
            }
        },
        []
    );

    const handleGenerateKey = useCallback(async () => {
        if (!userProfile) {
            toast.error("User not authenticated.");
            return;
        }

        if (!canGenerateMore) {
            toast.error(`Maximum of ${MAX_API_KEYS} API keys allowed.`);
            return;
        }

        setGenerating(true);
        setNewSecret(null);
        setNewId(null);
        setError(null);

        try {
            const res = await axios.post(
                "/api-credentials",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    validateStatus: () => true,
                }
            );

            if (res.status !== 201 && res.status !== 200) {
                throw new Error(res.data?.message || "Unknown error");
            }

            console.log("Generated API key response:", res.data);

            const { _id, apiKey, rawSecret, credential } = res.data;

            // Set the new secret and ID for showing the secret
            setNewSecret(rawSecret);
            setNewId(_id);
            setShowSecret(true);

            // Add the new credential to the store
            addApiCredential(credential);

            toast.success(
                "API key generated successfully! Copy the secret now - it won't be shown again."
            );
        } catch (err: any) {
            console.error("API key generation failed:", err);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "Failed to generate API key";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setGenerating(false);
        }
    }, [userProfile, canGenerateMore, addApiCredential, token]);

    const handleDeleteKey = useCallback(
        async (keyId: string) => {
            if (!userProfile) return;

            try {
                const res = await axios.delete(`/api-credentials/${keyId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (res.status === 200) {
                    removeApiCredential(keyId);

                    // Clear new key state if we're deleting the newly created key
                    if (keyId === newId) {
                        setNewSecret(null);
                        setNewId(null);
                        setShowSecret(false);
                    }

                    toast.success("API key deleted successfully.");
                } else {
                    throw new Error(
                        res.data?.message || "Failed to delete API key"
                    );
                }
            } catch (err: any) {
                console.error("Delete failed:", err);
                const errorMessage =
                    err.response?.data?.message ||
                    err.message ||
                    "Failed to delete API key";
                toast.error(errorMessage);
            }
        },
        [userProfile, newId, removeApiCredential, token]
    );

    const toggleSecret = useCallback(() => {
        setShowSecret((prev) => !prev);
    }, []);

    return {
        userProfile,
        credentials,
        loading,
        error,
        canGenerateMore,
        generating,
        newSecret,
        newId,
        showSecret,
        copiedStates,
        handleCopy,
        handleGenerateKey,
        handleDeleteKey,
        toggleSecret,
        fetchApiCredentials,
    };
}
