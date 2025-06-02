import { Loader2 } from "lucide-react";

export function Loader() {
	return (
		<div className="flex items-center justify-center h-24 w-full">
			<Loader2 className="h-6 w-6 animate-spin text-primary" />
		</div>
	);
}
