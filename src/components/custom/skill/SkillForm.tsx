// components/skills/SkillForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { useUserModules } from "@/hooks/useUserModules";
import type { Skill, CreateSkillData, UpdateSkillData } from "@/types/index";

interface SkillFormProps {
	isOpen: boolean;
	onClose: () => void;
	skill?: Skill;
	mode: "create" | "edit";
}

const SKILL_LEVELS = [
	{ value: "Beginner", label: "Beginner" },
	{ value: "Intermediate", label: "Intermediate" },
	{ value: "Advanced", label: "Advanced" },
	{ value: "Expert", label: "Expert" },
];

const SKILL_CATEGORIES = [
	{ value: "Programming", label: "Programming" },
	{ value: "Design", label: "Design" },
	{ value: "Marketing", label: "Marketing" },
	{ value: "Management", label: "Management" },
	{ value: "Communication", label: "Communication" },
	{ value: "Technical", label: "Technical" },
	{ value: "Creative", label: "Creative" },
	{ value: "Analytical", label: "Analytical" },
	{ value: "Other", label: "Other" },
];

export function SkillForm({ isOpen, onClose, skill, mode }: SkillFormProps) {
	const { createModuleItem, updateModuleItem, loading } = useUserModules();

	const [formData, setFormData] = useState<CreateSkillData>({
		name: "",
		level: "Beginner",
		category: "",
	});

	const [errors, setErrors] = useState<Record<string, string>>({});

	// Update form data when skill prop changes or dialog opens
	useEffect(() => {
		if (isOpen) {
			if (mode === "edit" && skill) {
				setFormData({
					name: skill.name || "",
					level: skill.level || "Beginner",
					category: skill.category || "",
				});
			} else {
				// Reset to default values for create mode
				setFormData({
					name: "",
					level: "Beginner",
					category: "",
				});
			}
			setErrors({});
		}
	}, [isOpen, skill, mode]);


	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = "Skill name is required";
		}

		if (!formData.level) {
			newErrors.level = "Skill level is required";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) return;

		try {
			if (mode === "create") {
				await createModuleItem("skills", formData);
				toast.success("Skill created successfully");
			} else if (skill?._id) {
				await updateModuleItem(
					"skills",
					skill._id,
					formData as UpdateSkillData
				);
				toast.success("Skill updated successfully");
			}

			onClose();
		} catch (error) {
			console.error("Error saving skill:", error);
			toast.error(
				mode === "create"
					? "Failed to create skill"
					: "Failed to update skill"
			);
		}
	};

	const handleClose = () => {
		onClose();
	};

	const getLevelBadgeColor = (level: string) => {
		switch (level) {
			case "Beginner":
				return "bg-red-100 text-red-800";
			case "Intermediate":
				return "bg-yellow-100 text-yellow-800";
			case "Advanced":
				return "bg-blue-100 text-blue-800";
			case "Expert":
				return "bg-green-100 text-green-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>
						{mode === "create" ? "Add New Skill" : "Edit Skill"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="name">Skill Name *</Label>
						<Input
							id="name"
							value={formData.name}
							onChange={(e) =>
								setFormData({
									...formData,
									name: e.target.value,
								})
							}
							placeholder="e.g., JavaScript, Adobe Photoshop, Project Management"
							className={errors.name ? "border-red-500" : ""}
						/>
						{errors.name && (
							<p className="text-sm text-red-500">
								{errors.name}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="level">Proficiency Level *</Label>
						<Select
							value={formData.level}
							onValueChange={(value) =>
								setFormData({
									...formData,
									level: value as any,
								})
							}
						>
							<SelectTrigger
								className={`cursor-pointer ${errors.level ? "border-red-500" : ""}`}
							>
								<SelectValue placeholder="Select proficiency level" />
							</SelectTrigger>
							<SelectContent>
								{SKILL_LEVELS.map((level) => (
									<SelectItem
										key={level.value}
										value={level.value}
										className="cursor-pointer"
									>
										<div className="flex items-center gap-2">
											<span
												className={`px-2 py-1 rounded-full text-xs ${getLevelBadgeColor(level.value)}`}
											>
												{level.label}
											</span>
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{errors.level && (
							<p className="text-sm text-red-500">
								{errors.level}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="category">Category</Label>
						<Select
							value={formData.category}
							onValueChange={(value) =>
								setFormData({ ...formData, category: value })
							}
						>
							<SelectTrigger className="cursor-pointer">
								<SelectValue placeholder="Select category (optional)" />
							</SelectTrigger>
							<SelectContent>
								{SKILL_CATEGORIES.map((category) => (
									<SelectItem
										key={category.value}
										value={category.value}
										className="cursor-pointer"
									>
										{category.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={handleClose}
							disabled={loading}
							className="cursor-pointer"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={loading}
							className="cursor-pointer"
						>
							{loading
								? "Saving..."
								: mode === "create"
									? "Create Skill"
									: "Update Skill"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
