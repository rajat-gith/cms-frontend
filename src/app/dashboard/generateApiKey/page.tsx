"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, Eye, EyeOff, Trash2, Copy, Check } from "lucide-react";
import bcrypt from "bcryptjs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { ApiCredential } from "@/types";

export default function ApiKeyPage() {
	const { userProfile, updateProfile, loading, error, fetchProfile } =
		useUserProfile();

	const [generating, setGenerating] = useState(false);
	const [newSecret, setNewSecret] = useState<string | null>(null);
	const [newId, setNewId] = useState<string | null>(null);
	const [showSecret, setShowSecret] = useState(false);
	const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>(
		{}
	);

	useEffect(() => {
		if (!userProfile) {
			fetchProfile();
		}
	}, [userProfile, fetchProfile]);

	const handleCopy = async (
		text: string,
		type: "key" | "secret",
		credId?: string
	) => {
		try {
			await navigator.clipboard.writeText(text);
			const copyId = credId ? `${type}-${credId}` : type;
			setCopiedStates((prev) => ({ ...prev, [copyId]: true }));
			toast.success(
				`${type === "key" ? "API Key" : "Secret"} copied to clipboard!`
			);

			setTimeout(() => {
				setCopiedStates((prev) => ({ ...prev, [copyId]: false }));
			}, 2000);
		} catch (err) {
			toast.error("Failed to copy to clipboard");
		}
	};

	const handleGenerateKey = async () => {
		if (!userProfile) {
			toast.error("User profile not loaded. Please try again.");
			return;
		}

		const currentCredentials = userProfile.apiCredentials || [];
		if (currentCredentials.length >= 2) {
			toast.error(
				"Maximum of 2 API keys allowed. Please delete an existing key first."
			);
			return;
		}

		setGenerating(true);
		setNewSecret(null);
		setNewId(null);
		setShowSecret(true);

		const apiKey = uuidv4();
		const rawSecret = uuidv4();

		try {
			const hashedSecret = await bcrypt.hash(rawSecret, 10);

			const newCredential: Omit<ApiCredential, "_id"> = {
				apiKey,
				apiSecret: hashedSecret,
				createdAt: new Date().toISOString(),
			};

			// Create updated credentials array
			const updatedCredentials = [...currentCredentials, newCredential];

			// Update the profile with new API credentials
			await updateProfile({
				apiCredentials: updatedCredentials as ApiCredential[],
			});

			// Set the new secret and ID for display
			setNewSecret(rawSecret);
			// Use the apiKey as identifier since _id will be assigned by backend
			setNewId(apiKey);

			toast.success("New API key generated! Copy the secret now.");
		} catch (err) {
			console.error("Error generating API key:", err);
			toast.error("Failed to generate API key. Please try again.");
		} finally {
			setGenerating(false);
		}
	};

	const handleDeleteKey = async (keyId: string) => {
		if (!userProfile) return;

		try {
			const updated =
				userProfile.apiCredentials?.filter(
					(cred) => cred._id !== keyId
				) || [];
			await updateProfile({ apiCredentials: updated });

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
	};

	const credentials = userProfile?.apiCredentials || [];
	const loadingInitial = loading && !userProfile;
	const canGenerateMore = credentials.length < 2;

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<h2 className="text-2xl font-semibold">Your API Keys</h2>
				<div className="text-sm text-muted-foreground">
					{credentials.length}/2 keys used
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
				</div>
			) : credentials.length === 0 ? (
				<div className="text-center py-8">
					<KeyRound className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
					<p className="text-muted-foreground mb-4">
						No API keys found. Generate one below.
					</p>
				</div>
			) : (
				<div className="space-y-4">
					{credentials.map((cred) => {
						// Check if this is the newly generated key (match by apiKey since _id might not be set yet)
						const isNewKey =
							cred.apiKey === newId || cred._id === newId;

						return (
							<Card
								key={cred._id || cred.apiKey}
								className="relative"
							>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="flex items-center gap-2 text-base font-medium">
										<KeyRound className="w-4 h-4" />
										API Key
									</CardTitle>

									<div className="flex items-center gap-2">
										{isNewKey && newSecret && (
											<Button
												variant="ghost"
												size="icon"
												onClick={() =>
													setShowSecret(!showSecret)
												}
												className="cursor-pointer hover:bg-accent"
												title={
													showSecret
														? "Hide secret"
														: "Show secret"
												}
											>
												{showSecret ? (
													<EyeOff className="w-4 h-4" />
												) : (
													<Eye className="w-4 h-4" />
												)}
											</Button>
										)}

										<Button
											variant="ghost"
											size="icon"
											onClick={() =>
												handleDeleteKey(cred._id)
											}
											className="cursor-pointer hover:bg-destructive/10 hover:text-destructive"
											title="Delete API key"
										>
											<Trash2 className="w-4 h-4" />
										</Button>
									</div>
								</CardHeader>

								<CardContent className="space-y-3">
									{/* API Key */}
									<div>
										<label className="text-xs font-medium text-muted-foreground mb-1 block">
											API Key
										</label>
										<div className="flex gap-2">
											<Input
												type="text"
												value={cred.apiKey}
												readOnly
												className="font-mono text-sm"
											/>
											<Button
												variant="outline"
												size="icon"
												onClick={() =>
													handleCopy(
														cred.apiKey,
														"key",
														cred._id
													)
												}
												className="cursor-pointer shrink-0"
												title="Copy API key"
											>
												{copiedStates[
													`key-${cred._id}`
												] ? (
													<Check className="w-4 h-4 text-green-600" />
												) : (
													<Copy className="w-4 h-4" />
												)}
											</Button>
										</div>
									</div>

									{/* API Secret */}
									<div>
										<label className="text-xs font-medium text-muted-foreground mb-1 block">
											API Secret
										</label>
										{isNewKey && newSecret ? (
											<div className="space-y-2">
												<div className="flex gap-2">
													<Input
														type={
															showSecret
																? "text"
																: "password"
														}
														value={newSecret}
														readOnly
														className="font-mono text-sm"
													/>
													<Button
														variant="outline"
														size="icon"
														onClick={() =>
															handleCopy(
																newSecret,
																"secret",
																cred._id
															)
														}
														className="cursor-pointer shrink-0"
														title="Copy secret"
													>
														{copiedStates[
															`secret-${cred._id}`
														] ? (
															<Check className="w-4 h-4 text-green-600" />
														) : (
															<Copy className="w-4 h-4" />
														)}
													</Button>
												</div>
												<p className="text-xs text-green-600 font-medium">
													⚠️ Important: Copy this
													secret now. It won't be
													shown again.
												</p>
											</div>
										) : (
											<div className="space-y-2">
												<Input
													type="password"
													value="••••••••••••••••••••••••••••••••"
													readOnly
													disabled
													className="font-mono text-sm"
												/>
												<p className="text-xs text-muted-foreground">
													Secret is securely stored as
													a hash and cannot be
													retrieved.
												</p>
											</div>
										)}
									</div>

									{/* Created date */}
									<p className="text-xs text-muted-foreground">
										Created:{" "}
										{new Date(
											cred.createdAt
										).toLocaleString()}
									</p>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}

			<div className="flex flex-col sm:flex-row gap-4 items-start">
				<Button
					onClick={handleGenerateKey}
					disabled={generating || !canGenerateMore || loading}
					className={`cursor-pointer ${!canGenerateMore || loading ? "cursor-not-allowed opacity-50" : ""}`}
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
						Maximum of 2 API keys reached. Delete an existing key to
						create a new one.
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
					<li>• You can generate up to 2 API keys maximum</li>
					<li>• Delete unused keys to maintain security</li>
				</ul>
			</div>
		</div>
	);
}
