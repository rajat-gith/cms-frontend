// components/skills/SkillCard.tsx
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash2, Tag } from "lucide-react";
import { toast } from "sonner";
import { useUserModules } from "@/hooks/useUserModules";
import type { Skill } from "@/types/index";

interface SkillCardProps {
	skill: Skill;
	onEdit: (skill: Skill) => void;
}

export function SkillCard({ skill, onEdit }: SkillCardProps) {
	const { deleteModuleItem, loading } = useUserModules();
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);

	const handleDelete = async () => {
		try {
			await deleteModuleItem("skills", skill._id);
			toast.success("Skill deleted successfully");
			setShowDeleteDialog(false);
		} catch (error) {
			console.error("Error deleting skill:", error);
			toast.error("Failed to delete skill");
		}
	};

	const getLevelBadgeColor = (level: string) => {
		switch (level) {
			case "Beginner":
				return "bg-red-100 text-red-800 hover:bg-red-200";
			case "Intermediate":
				return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
			case "Advanced":
				return "bg-blue-100 text-blue-800 hover:bg-blue-200";
			case "Expert":
				return "bg-green-100 text-green-800 hover:bg-green-200";
			default:
				return "bg-gray-100 text-gray-800 hover:bg-gray-200";
		}
	};

	const getLevelProgress = (level: string) => {
		switch (level) {
			case "Beginner":
				return 25;
			case "Intermediate":
				return 50;
			case "Advanced":
				return 75;
			case "Expert":
				return 100;
			default:
				return 0;
		}
	};

	return (
		<>
			<Card className="group hover:shadow-md transition-shadow duration-200 border-l-4 border-l-blue-500">
				<CardHeader className="pb-3 relative">
					{/* Add padding-right so text doesn't overlap with menu */}
					<div className="flex items-start justify-between pr-12">
						<div className="flex-1 min-w-0">
							<h3 className="font-semibold text-lg text-gray-900 mb-2 break-words">
								{skill.name}
							</h3>

							<div className="flex flex-wrap items-center gap-2 mb-3">
								<Badge
									className={`${getLevelBadgeColor(skill.level)} border-none`}
								>
									{skill.level}
								</Badge>

								{skill.category && (
									<Badge
										variant="outline"
										className="text-gray-600 border-gray-300 break-words"
									>
										<Tag className="w-3 h-3 mr-1" />
										{skill.category}
									</Badge>
								)}
							</div>

							{/* Progress Bar */}
							<div className="w-full bg-gray-200 rounded-full h-2">
								<div
									className={`h-2 rounded-full transition-all duration-300 ${skill.level === "Beginner"
											? "bg-red-500"
											: skill.level === "Intermediate"
												? "bg-yellow-500"
												: skill.level === "Advanced"
													? "bg-blue-500"
													: "bg-green-500"
										}`}
									style={{
										width: `${getLevelProgress(skill.level)}%`,
									}}
								/>
							</div>
						</div>
					</div>

					{/* Absolute positioned dropdown menu */}
					<div className="absolute top-3 right-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="ghost"
									className="h-8 w-8 p-0 cursor-pointer opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity"
								>
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem
									onClick={() => onEdit(skill)}
									className="cursor-pointer"
								>
									<Edit className="mr-2 h-4 w-4" />
									Edit
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => setShowDeleteDialog(true)}
									className="cursor-pointer text-red-600 focus:text-red-600"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</CardHeader>

				<CardContent className="pt-0">
					<div className="text-sm text-gray-500">
						Added{" "}
						{new Date(skill.createdAt).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</div>
				</CardContent>
			</Card>

			<AlertDialog
				open={showDeleteDialog}
				onOpenChange={setShowDeleteDialog}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Skill</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete "{skill.name}"? This
							action cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel className="cursor-pointer">
							Cancel
						</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDelete}
							disabled={loading}
							className="bg-red-600 hover:bg-red-700 cursor-pointer"
						>
							{loading ? "Deleting..." : "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
