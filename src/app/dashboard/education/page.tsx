"use client";

import { useState, useEffect } from "react";
import { useUserModuleStore } from "@/store/user.store";
import { useUserModules } from "@/hooks/useUserModules";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Plus } from "lucide-react";
import { EducationForm } from "@/components/custom/education/EducationForm";
import { EducationCard } from "@/components/custom/education/EducationCard";
import { toast } from "sonner";
import { Education } from "@/types";

export default function EducationPage() {
	const { modules } = useUserModuleStore();
	const {
		fetchModule,
		createModuleItem,
		updateModuleItem,
		deleteModuleItem,
		loading,
	} = useUserModules();
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	useEffect(() => {
		fetchModule("education");
	}, [fetchModule]);



	const handleCreate = async (data: Omit<Education, "_id">) => {
		try {
			await createModuleItem("education", data);
			setIsAddingNew(false);
			// Refresh the data after creating
			await fetchModule("education");
			toast.success("Education added successfully");
		} catch (error) {
			toast.error("Failed to add education");
		}
	};

	const handleUpdate = async (data: Omit<Education, "_id">) => {
		if (!editingId) return;
		try {
			await updateModuleItem("education", editingId, data);
			setEditingId(null);
			// Refresh the data after updating
			await fetchModule("education");
			toast.success("Education updated successfully");
		} catch (error) {
			toast.error("Failed to update education");
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteModuleItem("education", id);
			// Refresh the data after deleting
			await fetchModule("education");
			toast.success("Education deleted successfully");
		} catch (error) {
			toast.error("Failed to delete education");
		}
	};

	const educationToEdit = editingId
		? modules.education.find((edu) => edu._id === editingId)
		: undefined;

	return (
		<div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
			<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
				<h2 className="text-2xl font-semibold">Your Education</h2>
				<Button
					onClick={() => {
						setEditingId(null);
						setIsAddingNew(true);
					}}
					className="cursor-pointer w-full sm:w-auto"
					disabled={isAddingNew || Boolean(editingId)}
				>
					<Plus className="h-4 w-4 mr-2" />
					Add Education
				</Button>
			</div>

			{(isAddingNew || editingId) && (
				<Card>
					<CardHeader>
						<CardTitle>
							{editingId ? "Edit Education" : "Add New Education"}
						</CardTitle>
					</CardHeader>
					<CardContent>
						<EducationForm
							initialData={educationToEdit}
							onSubmit={editingId ? handleUpdate : handleCreate}
							onCancel={() => {
								setIsAddingNew(false);
								setEditingId(null);
							}}
							isLoading={loading}
						/>
					</CardContent>
				</Card>
			)}

			<div className="space-y-4">
				{loading ? (
					<Card className="text-center py-8">
						<CardContent className="flex flex-col items-center gap-4">
							<GraduationCap className="h-12 w-12 text-gray-400 animate-pulse" />
							<div>
								<h3 className="text-lg font-medium">
									Loading your education...
								</h3>
								<p className="text-gray-500">
									Please wait while we fetch your data.
								</p>
							</div>
						</CardContent>
					</Card>
				) : modules.education?.length === 0 ? (
					<Card className="text-center py-8">
						<CardContent className="flex flex-col items-center gap-4">
							<GraduationCap className="h-12 w-12 text-gray-400" />
							<div>
								<h3 className="text-lg font-medium">
									No education entries yet
								</h3>
								<p className="text-gray-500">
									Add your educational background to showcase
									your qualifications.
								</p>
							</div>
						</CardContent>
					</Card>
				) : (
					modules.education
						.filter((edu): edu is Education => !!edu?.courseName)
						.map((education) => (
							<EducationCard
								key={education._id}
								education={education}
								onEdit={() => {
									setEditingId(education._id);
									setIsAddingNew(false); // Fixed: should be false when editing
								}}
								onDelete={() => handleDelete(education._id)}
							/>
						))
				)}
			</div>
		</div>
	);
}
