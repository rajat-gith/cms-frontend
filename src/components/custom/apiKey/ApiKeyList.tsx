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
	if (credentials.length === 0) {
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
				// Check if this is the newly generated key
				const isNewKey = cred.apiKey === newId || cred._id === newId;

				return (
					<ApiKeyCard
						key={cred._id || cred.apiKey}
						credential={cred}
						isNewKey={isNewKey}
						newSecret={newSecret}
						showSecret={showSecret}
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
