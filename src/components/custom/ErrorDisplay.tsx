import { Button } from "../ui/button";

export const ErrorDisplay = ({ error }: { error: string }) => (
	<div className="p-6 max-w-3xl mx-auto text-center">
		<div className="bg-red-50 text-red-600 p-4 rounded-lg">
			Error loading profile: {error}
		</div>
		<Button
			variant="outline"
			className="mt-4"
			onClick={() => window.location.reload()}
		>
			Try Again
		</Button>
	</div>
);
