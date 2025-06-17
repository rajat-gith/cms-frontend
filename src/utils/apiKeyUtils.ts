import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ApiCredential } from "@/types/index";

export const MAX_API_KEYS = 2;

export const copyToClipboard = async (
	text: string,
	type: "key" | "secret",
	credId?: string
) => {
	try {
		await navigator.clipboard.writeText(text);
		toast.success(
			`${type === "key" ? "API Key" : "Secret"} copied to clipboard!`
		);

		// Return the copy ID for state management
		return credId ? `${type}-${credId}` : type;
	} catch (err) {
		toast.error("Failed to copy to clipboard");
		throw err;
	}
};

export const generateApiKeyPair = async () => {
	const apiKey = uuidv4();
	const rawSecret = uuidv4();
	const hashedSecret = await bcrypt.hash(rawSecret, 10);

	return {
		apiKey,
		rawSecret,
		hashedSecret,
	};
};

export const validateApiKeyGeneration = (
	currentCredentials: ApiCredential[]
) => {
	if (currentCredentials.length >= MAX_API_KEYS) {
		toast.error(
			"Maximum of 2 API keys allowed. Please delete an existing key first."
		);
		return false;
	}
	return true;
};
