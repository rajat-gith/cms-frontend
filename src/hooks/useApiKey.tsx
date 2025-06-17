"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { ApiCredential, CopyState } from "@/types/index";
import { useUserProfile } from "@/hooks/useUserProfile";
import {
	copyToClipboard,
	generateApiKeyPair,
	validateApiKeyGeneration,
	MAX_API_KEYS,
} from "@/utils/apiKeyUtils";

export function useApiKeys() {
	const { userProfile, updateProfile, loading, error, fetchProfile } =
		useUserProfile();

	const [generating, setGenerating] = useState(false);
	const [newSecret, setNewSecret] = useState<string | null>(null);
	const [newId, setNewId] = useState<string | null>(null);
	const [showSecret, setShowSecret] = useState(false);
	const [copiedStates, setCopiedStates] = useState<CopyState>({});

	const credentials = userProfile?.apiCredentials || [];
	const canGenerateMore = credentials.length < MAX_API_KEYS;

	const handleCopy = useCallback(
		async (text: string, type: "key" | "secret", credId?: string) => {
			try {
				const copyId = await copyToClipboard(text, type, credId);
				setCopiedStates((prev) => ({ ...prev, [copyId]: true }));

				setTimeout(() => {
					setCopiedStates((prev) => ({ ...prev, [copyId]: false }));
				}, 2000);
			} catch (err) {
				// Error already handled in copyToClipboard
			}
		},
		[]
	);

	const handleGenerateKey = useCallback(async () => {
		if (!userProfile) {
			toast.error("User profile not loaded. Please try again.");
			return;
		}

		const currentCredentials = userProfile.apiCredentials || [];
		if (!validateApiKeyGeneration(currentCredentials)) {
			return;
		}

		setGenerating(true);
		setNewSecret(null);
		setNewId(null);
		setShowSecret(true);

		try {
			const { apiKey, rawSecret, hashedSecret } =
				await generateApiKeyPair();

			const newCredential: Omit<ApiCredential, "_id"> = {
				apiKey,
				apiSecret: hashedSecret,
			};

			// Create updated credentials array
			const updatedCredentials = [...currentCredentials, newCredential];

			// Update the profile with new API credentials
			await updateProfile({
				apiCredentials: updatedCredentials as ApiCredential[],
			});

			// Refresh the profile to get the latest data with _id assigned by backend
			await fetchProfile();

			// Set the new secret and ID for display
			setNewSecret(rawSecret);
			setNewId(apiKey);

			toast.success("New API key generated! Copy the secret now.");
		} catch (err) {
			console.error("Error generating API key:", err);
			toast.error("Failed to generate API key. Please try again.");
		} finally {
			setGenerating(false);
		}
	}, [userProfile, updateProfile, fetchProfile]);

	const handleDeleteKey = useCallback(
		async (keyId: string) => {
			if (!userProfile) return;

			try {
				const updated =
					userProfile.apiCredentials?.filter(
						(cred) => cred._id !== keyId
					) || [];
				await updateProfile({ apiCredentials: updated });

				// Refresh the profile to get the latest data
				await fetchProfile();

				// Clear the new secret if we're deleting the newly created key
				if (keyId === newId) {
					setNewSecret(null);
					setNewId(null);
				}

				toast.success("API key deleted successfully.");
			} catch (err) {
				console.error("Error deleting API key:", err);
				toast.error("Failed to delete API key.");
			}
		},
		[userProfile, updateProfile, fetchProfile, newId]
	);

	const toggleSecret = useCallback(() => {
		setShowSecret((prev) => !prev);
	}, []);

	return {
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
		fetchProfile,
	};
}
