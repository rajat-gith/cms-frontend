"use client";

import { useEffect } from "react";
import { Plus, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ExperienceCard } from "@/components/custom/experience/ExperienceCard";
import { ExperienceForm } from "@/components/custom/experience/ExperienceForm";
import { useUserModuleStore } from "@/store/user.store";
import { useUserModules } from "@/hooks/useUserModules";
import { useExperienceForm } from "@/hooks/useExperienceForm";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExperiencePage() {
	const { modules } = useUserModuleStore();
	const { fetchModule, loading } = useUserModules();
	const {
		isDialogOpen,
		editingExperience,
		loading: formLoading,
		openCreateDialog,
		openEditDialog,
		closeDialog,
		handleSubmit,
		handleDelete,
	} = useExperienceForm();

	useEffect(() => {
		fetchModule("experiences");
	}, [fetchModule]);

	const experiences = modules.experiences || [];

	if (loading) {
		return (
			<div className="container mx-auto p-6 max-w-6xl">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<div>
						<Skeleton className="h-8 w-48 mb-2" />
						<Skeleton className="h-4 w-64" />
					</div>
					<Skeleton className="h-10 w-36" />
				</div>

				<div className="grid gap-6">
					{[1, 2, 3].map((i) => (
						<Card key={i}>
							<CardContent className="p-6">
								<div className="space-y-4">
									<div className="flex justify-between">
										<div className="space-y-2 flex-1">
											<Skeleton className="h-6 w-48" />
											<Skeleton className="h-4 w-32" />
											<Skeleton className="h-4 w-24" />
										</div>
										<div className="flex gap-2">
											<Skeleton className="h-8 w-8" />
											<Skeleton className="h-8 w-8" />
										</div>
									</div>
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<div className="flex gap-2">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-20" />
										<Skeleton className="h-6 w-14" />
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="container mx-auto p-4 sm:p-6 max-w-6xl">
			{/* Header */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
				<div>
					<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
						<Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
						Work Experience
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage your professional work experience and roles
					</p>
				</div>
				<Button
					onClick={openCreateDialog}
					className="w-full sm:w-auto cursor-pointer"
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Experience
				</Button>
			</div>

			{/* Content */}
			{experiences.length === 0 ? (
				<Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
					<CardContent className="flex flex-col items-center justify-center py-12 text-center">
						<Briefcase className="h-12 w-12 text-gray-400 dark:text-gray-600 mb-4" />
						<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
							No work experience added yet
						</h3>
						<p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
							Start building your professional profile by adding
							your work experience, internships, and other
							professional roles.
						</p>
						<Button onClick={openCreateDialog}>
							<Plus className="h-4 w-4 mr-2" />
							Add Your First Experience
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 sm:gap-6">
					{experiences
						.sort((a, b) => {
							// Sort by ongoing first, then by start date (newest first)
							if (a.period.ongoing && !b.period.ongoing)
								return -1;
							if (!a.period.ongoing && b.period.ongoing) return 1;
							return (
								new Date(b.period.startDate).getTime() -
								new Date(a.period.startDate).getTime()
							);
						})
						.map((experience) => (
							<ExperienceCard
								key={experience._id}
								experience={experience}
								onEdit={openEditDialog}
								onDelete={handleDelete}
							/>
						))}
				</div>
			)}

			{/* Form Dialog */}
			<ExperienceForm
				isOpen={isDialogOpen}
				onClose={closeDialog}
				onSubmit={handleSubmit}
				initialData={editingExperience}
				isLoading={formLoading}
			/>
		</div>
	);
}
