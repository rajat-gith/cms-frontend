import { Skeleton } from "../ui/skeleton";

export const SkeletonLoader = () => (
	<div className="p-6 max-w-3xl mx-auto space-y-6">
		<Skeleton className="h-10 w-1/2 mb-6" />
		<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
			{Array.from({ length: 6 }, (_, i) => (
				<Skeleton key={i} className="h-10 w-full" />
			))}
		</div>
		<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
			{Array.from({ length: 3 }, (_, i) => (
				<Skeleton key={i} className="h-10 w-full" />
			))}
		</div>
		<Skeleton className="h-10 w-full" />
		<Skeleton className="h-10 w-full" />
		<Skeleton className="h-32 w-full" />
		<Skeleton className="h-10 w-32" />
	</div>
);
