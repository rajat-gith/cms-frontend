"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useUserModules } from "./useUserModules";
import type { Experience } from "@/types";
import type { ExperienceFormData } from "@/types/experience-form";

export function useExperienceForm() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [editingExperience, setEditingExperience] =
		useState<Experience | null>(null);
	const { createModuleItem, updateModuleItem, deleteModuleItem, loading } =
		useUserModules();

	const openCreateDialog = () => {
		setEditingExperience(null);
		setIsDialogOpen(true);
	};

	const openEditDialog = (experience: Experience) => {
		setEditingExperience(experience);
		setIsDialogOpen(true);
	};

	const closeDialog = () => {
		setIsDialogOpen(false);
		setEditingExperience(null);
	};

	const handleSubmit = async (data: ExperienceFormData) => {
		try {
			if (editingExperience) {
				await updateModuleItem(
					"experiences",
					editingExperience._id,
					data
				);
				toast.success("Experience updated successfully!");
			} else {
				await createModuleItem("experiences", data);
				toast.success("Experience added successfully!");
			}
			closeDialog();
		} catch (error) {
			console.error("Experience form error:", error);
			toast.error(
				editingExperience
					? "Failed to update experience"
					: "Failed to add experience"
			);
		}
	};

	const handleDelete = async (id: string) => {
		if (
			window.confirm("Are you sure you want to delete this experience?")
		) {
			try {
				await deleteModuleItem("experiences", id);
				toast.success("Experience deleted successfully!");
			} catch (error) {
				toast.error("Failed to delete experience");
			}
		}
	};

	return {
		isDialogOpen,
		editingExperience,
		loading,
		openCreateDialog,
		openEditDialog,
		closeDialog,
		handleSubmit,
		handleDelete,
	};
}
