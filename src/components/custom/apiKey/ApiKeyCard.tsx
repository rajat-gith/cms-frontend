"use client";

import { useState } from "react";
import { Copy, Eye, EyeOff, Trash2, Key, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ApiCredential, CopyState } from "@/types/index";
import { formatApiKey, formatDate } from "@/utils/apiKeyUtils";

interface ApiKeyCardProps {
    credential: ApiCredential;
    isNewKey: boolean;
    newSecret: string | null;
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
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);

    const handleDelete = () => {
        if (showConfirmDelete) {
            onDelete(credential._id);
            setShowConfirmDelete(false);
        } else {
            setShowConfirmDelete(true);
            // Auto-hide confirm after 3 seconds
            setTimeout(() => setShowConfirmDelete(false), 3000);
        }
    };

    const copyKeyId = `${credential._id}-key`;
    const copySecretId = `${credential._id}-secret`;
    const isKeyCopied = copiedStates[copyKeyId];
    const isSecretCopied = copiedStates[copySecretId];

    return (
        <Card
            className={`${isNewKey ? "ring-2 ring-green-500 bg-green-50" : ""}`}
        >
            <CardHeader className="pb-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <CardTitle className="text-lg flex items-center gap-2 flex-wrap">
                        <Key className="w-5 h-5" />
                        API Key
                        {isNewKey && (
                            <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                            >
                                New
                            </Badge>
                        )}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge
                            variant={
                                credential.isActive ? "default" : "secondary"
                            }
                        >
                            {credential.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            className={`${
                                showConfirmDelete
                                    ? "bg-red-100 text-red-700 border-red-300"
                                    : ""
                            }`}
                        >
                            <Trash2 className="w-4 h-4" />
                            {showConfirmDelete ? "Confirm Delete" : "Delete"}
                        </Button>
                    </div>
                </div>
                {credential.createdAt && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        Created: {formatDate(credential.createdAt)}
                    </div>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* API Key */}
                <div className="space-y-2">
                    <label className="text-sm font-medium">API Key</label>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <code className="flex-1 min-w-0 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                            {formatApiKey(credential.apiKey)}
                        </code>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full sm:w-auto"
                            onClick={() =>
                                onCopy(credential.apiKey, "key", credential._id)
                            }
                        >
                            <Copy className="w-4 h-4" />
                            {isKeyCopied ? "Copied!" : "Copy"}
                        </Button>
                    </div>
                </div>

                {/* API Secret - Only show for new keys */}
                {isNewKey && newSecret && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-orange-700">
                            API Secret (Save this now - it won't be shown
                            again!)
                        </label>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                            <code className="flex-1 min-w-0 p-2 bg-orange-50 border border-orange-200 rounded text-sm font-mono break-all">
                                {showSecret ? newSecret : "•".repeat(32)}
                            </code>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none"
                                    onClick={onToggleSecret}
                                >
                                    {showSecret ? (
                                        <EyeOff className="w-4 h-4" />
                                    ) : (
                                        <Eye className="w-4 h-4" />
                                    )}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 sm:flex-none"
                                    onClick={() =>
                                        onCopy(newSecret, "secret", credential._id)
                                    }
                                >
                                    <Copy className="w-4 h-4" />
                                    {isSecretCopied ? "Copied!" : "Copy"}
                                </Button>
                            </div>
                        </div>
                        <p className="text-xs text-orange-600">
                            ⚠️ This secret will only be displayed once. Make
                            sure to copy and save it securely.
                        </p>
                    </div>
                )}

                {/* Warning for existing keys */}
                {!isNewKey && (
                    <div className="text-xs text-muted-foreground p-2 bg-gray-50 rounded">
                        The API secret for this key is not displayed for
                        security reasons.
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
