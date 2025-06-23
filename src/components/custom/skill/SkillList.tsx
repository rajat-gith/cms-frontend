// components/skills/SkillsList.tsx
"use client";

import { useState, useMemo } from "react";
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
import { Plus, Search, Filter, BarChart3 } from "lucide-react";
import { SkillCard } from "./SkillCard";
import { SkillForm } from "./SkillForm";
import type { Skill } from "@/types/index";

interface SkillsListProps {
	skills: Skill[];
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];
const SKILL_CATEGORIES = [
	"Programming",
	"Design",
	"Marketing",
	"Management",
	"Communication",
	"Technical",
	"Creative",
	"Analytical",
	"Other",
];

export function SkillsList({ skills }: SkillsListProps) {
	const [showForm, setShowForm] = useState(false);
	const [editingSkill, setEditingSkill] = useState<Skill | undefined>();
	const [searchTerm, setSearchTerm] = useState("");
	const [levelFilter, setLevelFilter] = useState<string>("all");
	const [categoryFilter, setCategoryFilter] = useState<string>("all");

	const filteredSkills = useMemo(() => {
		return skills.filter((skill) => {
			const matchesSearch =
				skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				(skill.category
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ??
					false);
			const matchesLevel =
				levelFilter === "all" || skill.level === levelFilter;
			const matchesCategory =
				categoryFilter === "all" || skill.category === categoryFilter;

			return matchesSearch && matchesLevel && matchesCategory;
		});
	}, [skills, searchTerm, levelFilter, categoryFilter]);

	const skillStats = useMemo(() => {
		const stats = {
			total: skills.length,
			byLevel: {} as Record<string, number>,
			byCategory: {} as Record<string, number>,
		};

		skills.forEach((skill) => {
			stats.byLevel[skill.level] = (stats.byLevel[skill.level] || 0) + 1;

			if (skill.category) {
				stats.byCategory[skill.category] =
					(stats.byCategory[skill.category] || 0) + 1;
			}
		});

		return stats;
	}, [skills]);

	const handleEdit = (skill: Skill) => {
		setEditingSkill(skill);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingSkill(undefined);
	};

	const clearFilters = () => {
		setSearchTerm("");
		setLevelFilter("all");
		setCategoryFilter("all");
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-900">Skills</h2>
					<p className="text-gray-600 mt-1">
						Manage your professional skills and expertise levels
					</p>
				</div>
				<Button
					onClick={() => setShowForm(true)}
					className="cursor-pointer flex items-center gap-2"
				>
					<Plus className="h-4 w-4" />
					Add Skill
				</Button>
			</div>

			{/* Stats Section */}
			{skills.length > 0 && (
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{skillStats.total}
						</div>
						<div className="text-sm text-gray-600">
							Total Skills
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							{skillStats.byLevel["Expert"] || 0}
						</div>
						<div className="text-sm text-gray-600">
							Expert Level
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-blue-600">
							{skillStats.byLevel["Advanced"] || 0}
						</div>
						<div className="text-sm text-gray-600">
							Advanced Level
						</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-purple-600">
							{Object.keys(skillStats.byCategory).length}
						</div>
						<div className="text-sm text-gray-600">Categories</div>
					</div>
				</div>
			)}

			{/* Search and Filter Section */}
			{skills.length > 0 && (
				<div className="flex flex-col lg:flex-row gap-4 p-4 bg-white border rounded-lg">
					<div className="flex-1">
						<Label htmlFor="search" className="sr-only">
							Search skills
						</Label>
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								id="search"
								placeholder="Search skills by name or category..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
					</div>

					<div className="flex flex-col sm:flex-row gap-2">
						<Select
							value={levelFilter}
							onValueChange={setLevelFilter}
						>
							<SelectTrigger className="w-full sm:w-[160px] cursor-pointer">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by level" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value="all"
									className="cursor-pointer"
								>
									All Levels
								</SelectItem>
								{SKILL_LEVELS.map((level) => (
									<SelectItem
										key={level}
										value={level}
										className="cursor-pointer"
									>
										{level} (
										{skillStats.byLevel[level] || 0})
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						<Select
							value={categoryFilter}
							onValueChange={setCategoryFilter}
						>
							<SelectTrigger className="w-full sm:w-[160px] cursor-pointer">
								<BarChart3 className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter by category" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem
									value="all"
									className="cursor-pointer"
								>
									All Categories
								</SelectItem>
								{SKILL_CATEGORIES.map((category) => (
									<SelectItem
										key={category}
										value={category}
										className="cursor-pointer"
									>
										{category} (
										{skillStats.byCategory[category] || 0})
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{(searchTerm ||
							levelFilter !== "all" ||
							categoryFilter !== "all") && (
							<Button
								variant="outline"
								onClick={clearFilters}
								className="cursor-pointer whitespace-nowrap"
							>
								Clear Filters
							</Button>
						)}
					</div>
				</div>
			)}

			{/* Skills Grid */}
			{filteredSkills.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{filteredSkills.map((skill) => (
						<SkillCard
							key={skill._id}
							skill={skill}
							onEdit={handleEdit}
						/>
					))}
				</div>
			) : skills.length > 0 ? (
				<div className="text-center py-12">
					<div className="text-gray-500 mb-4">
						<Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p className="text-lg">
							No skills match your current filters
						</p>
						<p className="text-sm">
							Try adjusting your search terms or filters
						</p>
					</div>
					<Button
						variant="outline"
						onClick={clearFilters}
						className="cursor-pointer"
					>
						Clear All Filters
					</Button>
				</div>
			) : (
				<div className="text-center py-12">
					<div className="text-gray-500 mb-4">
						<BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
						<p className="text-lg">No skills added yet</p>
						<p className="text-sm text-gray-400">
							Start building your professional profile by adding
							your first skill
						</p>
					</div>
					<Button
						onClick={() => setShowForm(true)}
						className="cursor-pointer"
					>
						<Plus className="h-4 w-4 mr-2" />
						Add Your First Skill
					</Button>
				</div>
			)}

			{/* Form Modal */}
			<SkillForm
				isOpen={showForm}
				onClose={handleCloseForm}
				skill={editingSkill}
				mode={editingSkill ? "edit" : "create"}
			/>
		</div>
	);
}
