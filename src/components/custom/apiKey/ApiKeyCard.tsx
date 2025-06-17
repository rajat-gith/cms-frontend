"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, Eye, EyeOff, Trash2, Copy, Check } from "lucide-react";
import { ApiCredential, CopyState } from "@/types/index";

interface ApiKeyCardProps {
	credential: ApiCredential;
	isNewKey: boolean;
	newSecret?: string | null;
	showSecret: boolean;
	copiedStates: CopyState;
	onToggleSecret: () => void;
	onDelete: (keyId: string) => void;
	onCopy: (text: string, type: "key" | "secret", credId?: string) => void;
}

export function ApiKeyCard({
	credential,
	isNewKey,
	newSecret,
	showSecret,
	copiedStates,
	onToggleSecret,
	onDelete,
	onCopy,
}: ApiKeyCardProps) {
	return (
		<Card className="relative">
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
							onClick={onToggleSecret}
							className="cursor-pointer hover:bg-accent"
							title={showSecret ? "Hide secret" : "Show secret"}
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
						onClick={() => onDelete(credential._id)}
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
							value={credential.apiKey}
							readOnly
							className="font-mono text-sm"
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={() =>
								onCopy(credential.apiKey, "key", credential._id)
							}
							className="cursor-pointer shrink-0"
							title="Copy API key"
						>
							{copiedStates[`key-${credential._id}`] ? (
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
									type={showSecret ? "text" : "password"}
									value={newSecret}
									readOnly
									className="font-mono text-sm"
								/>
								<Button
									variant="outline"
									size="icon"
									onClick={() =>
										onCopy(
											newSecret,
											"secret",
											credential._id
										)
									}
									className="cursor-pointer shrink-0"
									title="Copy secret"
								>
									{copiedStates[
										`secret-${credential._id}`
									] ? (
										<Check className="w-4 h-4 text-green-600" />
									) : (
										<Copy className="w-4 h-4" />
									)}
								</Button>
							</div>
							<p className="text-xs text-green-600 font-medium">
								⚠️ Important: Copy this secret now. It
								won&apos;t be shown again.
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
								Secret is securely stored as a hash and cannot
								be retrieved.
							</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
