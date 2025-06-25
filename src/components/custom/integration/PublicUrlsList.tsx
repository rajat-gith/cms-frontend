// components/integration/PublicUrlsList.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Database } from "lucide-react";

interface PublicUrl {
    entity: string;
    description: string;
    endpoint: string;
}

interface PublicUrlsListProps {
    urls: PublicUrl[];
    onCopy: (text: string) => void;
    onSelect: (url: string) => void;
    getFullUrl: (endpoint: string) => string;
}

export function PublicUrlsList({
    urls,
    onCopy,
    onSelect,
    getFullUrl,
}: PublicUrlsListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Available Public URLs
                </CardTitle>
                <CardDescription>
                    Click on any URL to copy it or view usage examples
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {urls.map((url) => (
                        <div
                            key={url.entity}
                            className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                            onClick={() => onSelect(url.endpoint)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h4 className="font-medium capitalize">
                                        {url.entity}
                                    </h4>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {url.description}
                                    </p>
                                    <code className="text-xs bg-muted px-2 py-1 rounded">
                                        {url.endpoint}
                                    </code>
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Requires: X-API-Key & X-API-Secret
                                        headers
                                    </p>
                                </div>
                                <div className="flex gap-2 ml-4">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onCopy(getFullUrl(url.endpoint));
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
