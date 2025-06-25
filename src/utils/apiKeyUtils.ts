import { toast } from "sonner";
import { ApiCredential } from "@/types/index";

export const MAX_API_KEYS = 2; // Match the backend constant

export const validateApiKeyGeneration = (
    credentials: ApiCredential[]
): boolean => {
    if (credentials.length >= MAX_API_KEYS) {
        toast.error(`Maximum of ${MAX_API_KEYS} API keys allowed.`);
        return false;
    }
    return true;
};

export const copyToClipboard = async (
    text: string,
    type: "key" | "secret",
    credId?: string
): Promise<string> => {
    try {
        await navigator.clipboard.writeText(text);
        const copyId = credId ? `${credId}-${type}` : type;
        return copyId;
    } catch (error) {
        console.error("Failed to copy to clipboard:", error);
        toast.error("Failed to copy to clipboard");
        throw error;
    }
};

export const formatApiKey = (apiKey: string): string => {
    if (!apiKey) return "";

    // Show first 8 characters and last 4 characters
    if (apiKey.length <= 12) return apiKey;

    return `${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`;
};

export const formatDate = (dateString: string): string => {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    } catch (error) {
        return "Invalid date";
    }
};
