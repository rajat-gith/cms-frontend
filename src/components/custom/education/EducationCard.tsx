"use client";

import { Education } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, BookOpen, Award, Calendar } from "lucide-react";
import { format } from "date-fns";

interface EducationCardProps {
	education: Education;
	onEdit: () => void;
	onDelete: () => void;
}

export function EducationCard({
	education,
	onEdit,
	onDelete,
}: EducationCardProps) {
	const formatDate = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return format(date, "MMM yyyy");
	};

	return (
		<div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
			<div className="flex justify-between items-start mb-4">
				<div className="flex items-start gap-3">
					<GraduationCap className="h-6 w-6 text-blue-600 mt-1 flex-shrink-0" />
					<div>
						<h3 className="text-xl font-semibold">
							{education.courseName}
						</h3>
						<p className="text-lg text-gray-700">
							{education.degree}
						</p>
						<div className="flex items-center gap-2 text-gray-600 mt-1">
							<BookOpen className="h-4 w-4" />
							<span>{education.institute}</span>
						</div>
					</div>
				</div>
				<div className="flex gap-2">
					<Button
						className="cursor-pointer"
						variant="ghost"
						size="sm"
						onClick={onEdit}
					>
						Edit
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={onDelete}
						className="text-red-600 hover:text-red-700 cursor-pointer"
					>
						Delete
					</Button>
				</div>
			</div>

			<div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
				<div className="flex items-center gap-1">
					<Calendar className="h-4 w-4" />
					<span>
						{formatDate(education.periodOfCourse.startDate)} -{" "}
						{education.periodOfCourse.isOngoing ? (
							<Badge variant="secondary">Ongoing</Badge>
						) : (
							formatDate(education.periodOfCourse.endDate || "")
						)}
					</span>
				</div>
				<div className="flex items-center gap-1">
					<Award className="h-4 w-4" />
					<Badge variant="outline">
						{education.grades.type.toUpperCase()}:{" "}
						{education.grades.value}
						{education.grades.type === "percentage" && "%"}
					</Badge>
				</div>
			</div>

			{education.skills && education.skills.length > 0 && (
				<div className="mb-3">
					<p className="text-sm font-medium text-gray-700 mb-2">
						Skills:
					</p>
					<div className="flex flex-wrap gap-1">
						{education.skills.map((skill, index) => (
							<Badge
								key={index}
								variant="secondary"
								className="text-xs"
							>
								{skill}
							</Badge>
						))}
					</div>
				</div>
			)}

			{education.courseworks && education.courseworks.length > 0 && (
				<div>
					<p className="text-sm font-medium text-gray-700 mb-2">
						Courseworks:
					</p>
					<div className="flex flex-wrap gap-1">
						{education.courseworks.map((coursework, index) => (
							<Badge
								key={index}
								variant="outline"
								className="text-xs"
							>
								{coursework}
							</Badge>
						))}
					</div>
				</div>
			)}
		</div>
	);
}
