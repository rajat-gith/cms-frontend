"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, MapPin, Calendar, Building } from "lucide-react";
import { format } from "date-fns";
import type { Experience } from "@/types";

interface ExperienceCardProps {
	experience: Experience;
	onEdit: (experience: Experience) => void;
	onDelete: (id: string) => void;
}

export function ExperienceCard({
	experience,
	onEdit,
	onDelete,
}: ExperienceCardProps) {
	const formatDate = (dateString: string) => {
		try {
			// Handle both MongoDB date format and regular date strings
			const date = new Date(dateString);
			if (isNaN(date.getTime())) {
				return dateString; // Return original if can't parse
			}
			return format(date, "MMM yyyy");
		} catch {
			return dateString;
		}
	};

	const getPeriodString = () => {
		const start = formatDate(experience.period.startDate);
		if (experience.period.ongoing) {
			return `${start} - Present`;
		}
		if (experience.period.endDate) {
			return `${start} - ${formatDate(experience.period.endDate)}`;
		}
		return start;
	};

	return (
		<Card className="group hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1">
						<h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
							{experience.title}
						</h3>
						<div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mt-1">
							<Building className="h-4 w-4" />
							<span className="font-medium">
								{experience.company}
							</span>
						</div>
						{experience.location && (
							<div className="flex items-center gap-2 text-gray-500 dark:text-gray-500 mt-1">
								<MapPin className="h-4 w-4" />
								<span className="text-sm">
									{experience.location}
								</span>
							</div>
						)}
					</div>
					<div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							variant="outline"
							size="sm"
							onClick={() => onEdit(experience)}
							className="h-8 w-8 p-0"
						>
							<Edit className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => onDelete(experience._id)}
							className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
						>
							<Trash2 className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="pt-0">
				<div className="space-y-3">
					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className="text-xs">
							{experience.employmentType}
						</Badge>
						<div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-500">
							<Calendar className="h-3 w-3" />
							<span>{getPeriodString()}</span>
						</div>
					</div>

					{experience.description && (
						<p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-3">
							{experience.description}
						</p>
					)}

					{experience.technologiesUsed &&
						experience.technologiesUsed.length > 0 && (
							<div className="flex flex-wrap gap-1">
								{experience.technologiesUsed.map(
									(tech, index) => (
										<Badge
											key={index}
											variant="outline"
											className="text-xs"
										>
											{tech}
										</Badge>
									)
								)}
							</div>
						)}
				</div>
			</CardContent>
		</Card>
	);
}
