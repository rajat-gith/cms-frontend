// utils/skills.utils.ts
import type { Skill } from "@/types/index";

/**
 * Get the appropriate color class for skill level badges
 */
export const getSkillLevelColor = (level: string): string => {
	const colorMap: Record<string, string> = {
		Beginner: "bg-red-100 text-red-800 hover:bg-red-200 border-red-200",
		Intermediate:
			"bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200",
		Advanced: "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200",
		Expert: "bg-green-100 text-green-800 hover:bg-green-200 border-green-200",
	};
	return (
		colorMap[level] ||
		"bg-gray-100 text-gray-800 hover:bg-gray-200 border-gray-200"
	);
};

/**
 * Get progress percentage for skill level
 */
export const getSkillLevelProgress = (level: string): number => {
	const progressMap: Record<string, number> = {
		Beginner: 25,
		Intermediate: 50,
		Advanced: 75,
		Expert: 100,
	};
	return progressMap[level] || 0;
};

/**
 * Get progress bar color for skill level
 */
export const getSkillLevelProgressColor = (level: string): string => {
	const colorMap: Record<string, string> = {
		Beginner: "bg-red-500",
		Intermediate: "bg-yellow-500",
		Advanced: "bg-blue-500",
		Expert: "bg-green-500",
	};
	return colorMap[level] || "bg-gray-500";
};

/**
 * Sort skills by various criteria
 */
export const sortSkills = (skills: Skill[], sortBy: string): Skill[] => {
	const sortedSkills = [...skills];

	switch (sortBy) {
		case "name":
			return sortedSkills.sort((a, b) => a.name.localeCompare(b.name));

		case "level":
			const levelOrder = [
				"Beginner",
				"Intermediate",
				"Advanced",
				"Expert",
			];
			return sortedSkills.sort((a, b) => {
				const aIndex = levelOrder.indexOf(a.level);
				const bIndex = levelOrder.indexOf(b.level);
				return bIndex - aIndex; // Expert first
			});

		case "category":
			return sortedSkills.sort((a, b) => {
				const aCategory = a.category || "Uncategorized";
				const bCategory = b.category || "Uncategorized";
				return aCategory.localeCompare(bCategory);
			});

		case "dateAdded":
			return sortedSkills.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() -
					new Date(a.createdAt).getTime()
			);

		case "dateUpdated":
			return sortedSkills.sort(
				(a, b) =>
					new Date(b.updatedAt).getTime() -
					new Date(a.updatedAt).getTime()
			);

		default:
			return sortedSkills;
	}
};

/**
 * Group skills by category
 */
export const groupSkillsByCategory = (
	skills: Skill[]
): Record<string, Skill[]> => {
	return skills.reduce(
		(groups, skill) => {
			const category = skill.category || "Uncategorized";
			if (!groups[category]) {
				groups[category] = [];
			}
			groups[category].push(skill);
			return groups;
		},
		{} as Record<string, Skill[]>
	);
};

/**
 * Group skills by level
 */
export const groupSkillsByLevel = (
	skills: Skill[]
): Record<string, Skill[]> => {
	return skills.reduce(
		(groups, skill) => {
			if (!groups[skill.level]) {
				groups[skill.level] = [];
			}
			groups[skill.level].push(skill);
			return groups;
		},
		{} as Record<string, Skill[]>
	);
};

/**
 * Get skill statistics
 */
export const getSkillStatistics = (skills: Skill[]) => {
	const stats = {
		total: skills.length,
		byLevel: {} as Record<string, number>,
		byCategory: {} as Record<string, number>,
		averageLevel: 0,
		expertPercentage: 0,
		mostCommonCategory: "",
	};

	// Count by level and category
	skills.forEach((skill) => {
		stats.byLevel[skill.level] = (stats.byLevel[skill.level] || 0) + 1;

		const category = skill.category || "Uncategorized";
		stats.byCategory[category] = (stats.byCategory[category] || 0) + 1;
	});

	// Calculate average level (as numeric value)
	const levelValues = {
		Beginner: 1,
		Intermediate: 2,
		Advanced: 3,
		Expert: 4,
	};
	const totalLevelValue = skills.reduce(
		(sum, skill) => sum + levelValues[skill.level],
		0
	);
	stats.averageLevel =
		skills.length > 0 ? totalLevelValue / skills.length : 0;

	// Calculate expert percentage
	stats.expertPercentage =
		skills.length > 0
			? ((stats.byLevel["Expert"] || 0) / skills.length) * 100
			: 0;

	// Find most common category
	let maxCount = 0;
	Object.entries(stats.byCategory).forEach(([category, count]) => {
		if (count > maxCount) {
			maxCount = count;
			stats.mostCommonCategory = category;
		}
	});

	return stats;
};

/**
 * Validate skill data
 */
export const validateSkillData = (data: Partial<Skill>) => {
	const errors: Record<string, string> = {};

	if (!data.name || data.name.trim().length === 0) {
		errors.name = "Skill name is required";
	} else if (data.name.trim().length < 2) {
		errors.name = "Skill name must be at least 2 characters long";
	} else if (data.name.trim().length > 100) {
		errors.name = "Skill name must be less than 100 characters";
	}

	if (!data.level) {
		errors.level = "Skill level is required";
	} else if (
		!["Beginner", "Intermediate", "Advanced", "Expert"].includes(data.level)
	) {
		errors.level = "Invalid skill level";
	}

	if (data.category && data.category.trim().length > 50) {
		errors.category = "Category must be less than 50 characters";
	}

	return {
		isValid: Object.keys(errors).length === 0,
		errors,
	};
};

/**
 * Format skill for display
 */
export const formatSkillForDisplay = (skill: Skill) => {
	return {
		...skill,
		displayName: skill.name,
		displayLevel: skill.level,
		displayCategory: skill.category || "Uncategorized",
		createdAtFormatted: new Date(skill.createdAt).toLocaleDateString(
			"en-US",
			{
				year: "numeric",
				month: "short",
				day: "numeric",
			}
		),
		updatedAtFormatted: new Date(skill.updatedAt).toLocaleDateString(
			"en-US",
			{
				year: "numeric",
				month: "short",
				day: "numeric",
			}
		),
	};
};

/**
 * Export skills to CSV format
 */
export const exportSkillsToCSV = (skills: Skill[]): string => {
	const headers = ["Name", "Level", "Category", "Created At", "Updated At"];
	const csvContent = [
		headers.join(","),
		...skills.map((skill) =>
			[
				`"${skill.name}"`,
				`"${skill.level}"`,
				`"${skill.category || ""}"`,
				`"${new Date(skill.createdAt).toISOString()}"`,
				`"${new Date(skill.updatedAt).toISOString()}"`,
			].join(",")
		),
	].join("\n");

	return csvContent;
};

/**
 * Search skills with highlighting
 */
export const searchSkills = (skills: Skill[], searchTerm: string) => {
	if (!searchTerm.trim()) return skills;

	const term = searchTerm.toLowerCase().trim();
	return skills.filter(
		(skill) =>
			skill.name.toLowerCase().includes(term) ||
			(skill.category && skill.category.toLowerCase().includes(term))
	);
};
