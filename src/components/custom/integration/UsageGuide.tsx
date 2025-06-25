import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Code, Zap } from "lucide-react";
import { toast } from "sonner";

interface UsageGuideProps {
    selectedUrl?: string;
}

export function UsageGuide({ selectedUrl }: UsageGuideProps) {
    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code);
        toast.success("Code copied!");
    };

    const jsExample = `// JavaScript/Node.js
const response = await fetch('${selectedUrl || "YOUR_PUBLIC_URL"}', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY',
    'X-API-Secret': 'YOUR_API_SECRET'
  }
});

const data = await response.json();
console.log(data);`;

    const curlExample = `# cURL
curl -X GET "${selectedUrl || "YOUR_PUBLIC_URL"}" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: YOUR_API_KEY" \\
  -H "X-API-Secret: YOUR_API_SECRET"`;

    const pythonExample = `# Python
import requests

headers = {
    'Content-Type': 'application/json',
    'X-API-Key': 'YOUR_API_KEY',
    'X-API-Secret': 'YOUR_API_SECRET'
}

response = requests.get('${selectedUrl || "YOUR_PUBLIC_URL"}', headers=headers)
data = response.json()
print(data)`;

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Usage Guide
                    </CardTitle>
                    <CardDescription>
                        Use X-API-Key and X-API-Secret headers for
                        authentication
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-medium mb-2">JavaScript</h4>
                        <div className="relative">
                            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                                <code>{jsExample}</code>
                            </pre>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(jsExample)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">cURL</h4>
                        <div className="relative">
                            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                                <code>{curlExample}</code>
                            </pre>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(curlExample)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium mb-2">Python</h4>
                        <div className="relative">
                            <pre className="bg-muted p-3 rounded text-sm overflow-x-auto">
                                <code>{pythonExample}</code>
                            </pre>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="absolute top-2 right-2"
                                onClick={() => copyCode(pythonExample)}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Zap className="h-5 w-5" />
                        Quick Tips
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ul className="space-y-2 text-sm">
                        <li>• All responses are in JSON format</li>
                        <li>• X-API-Key and X-API-Secret headers required</li>
                        <li>• URLs are case-sensitive</li>
                        <li>• Rate limiting may apply</li>
                        <li>• Use HTTPS for production</li>
                        <li>• Never expose credentials in URLs</li>
                    </ul>
                </CardContent>
            </Card>
        </div>
    );
}
