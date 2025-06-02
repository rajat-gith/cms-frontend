"use client";

import { Education } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

interface EducationFormProps {
	initialData?: Partial<Education>;
	onSubmit: (data: Omit<Education, "_id">) => void;
	onCancel: () => void;
	isLoading?: boolean;
}

export function EducationForm({
	initialData,
	onSubmit,
	onCancel,
	isLoading,
}: EducationFormProps) {
	const formatToYearMonth = (dateString: string) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		const month = String(date.getMonth() + 1).padStart(2, "0");
		return `${date.getFullYear()}-${month}`;
	};

	const [formData, setFormData] = useState<Omit<Education, "_id">>({
		courseName: initialData?.courseName || "",
		institute: initialData?.institute || "",
		degree: initialData?.degree || "",
		periodOfCourse: {
			startDate: formatToYearMonth(
				initialData?.periodOfCourse?.startDate ?? ""
			),
			endDate: formatToYearMonth(
				initialData?.periodOfCourse?.endDate ?? ""
			),
			isOngoing: initialData?.periodOfCourse?.isOngoing || false,
		},
		skills: initialData?.skills || [],
		courseworks: initialData?.courseworks || [],
		grades: initialData?.grades || { type: "cgpa", value: 0 },
	});

	const [skillInput, setSkillInput] = useState("");
	const [courseworkInput, setCourseworkInput] = useState("");

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		const { name, value } = e.target;

		if (name.startsWith("periodOfCourse.")) {
			const field = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				periodOfCourse: {
					...prev.periodOfCourse,
					[field]: value,
				},
			}));
		} else if (name.startsWith("grades.")) {
			const field = name.split(".")[1];
			setFormData((prev) => ({
				...prev,
				grades: {
					...prev.grades,
					[field]: field === "value" ? Number(value) : value,
				},
			}));
		} else {
			setFormData((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	const addSkill = () => {
		const trimmedSkill = skillInput.trim();
		if (trimmedSkill && !(formData.skills ?? []).includes(trimmedSkill)) {
			setFormData((prev) => ({
				...prev,
				skills: [...(prev.skills ?? []), trimmedSkill],
			}));
			setSkillInput("");
		}
	};

	const removeSkill = (skill: string) => {
		setFormData((prev) => ({
			...prev,
			skills: (prev.skills ?? []).filter((s) => s !== skill),
		}));
	};

	const addCoursework = () => {
		const trimmedCoursework = courseworkInput.trim();
		if (
			trimmedCoursework &&
			!(formData.courseworks ?? []).includes(trimmedCoursework)
		) {
			setFormData((prev) => ({
				...prev,
				courseworks: [...(prev.courseworks ?? []), trimmedCoursework],
			}));
			setCourseworkInput("");
		}
	};

	const removeCoursework = (coursework: string) => {
		setFormData((prev) => ({
			...prev,
			courseworks: (prev.courseworks ?? []).filter(
				(c) => c !== coursework
			),
		}));
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="courseName">Course Name *</Label>
					<Input
						id="courseName"
						name="courseName"
						value={formData.courseName}
						onChange={handleInputChange}
						placeholder="Computer Science"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="institute">Institute *</Label>
					<Input
						id="institute"
						name="institute"
						value={formData.institute}
						onChange={handleInputChange}
						placeholder="University of Example"
						required
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="degree">Degree *</Label>
				<Input
					id="degree"
					name="degree"
					value={formData.degree}
					onChange={handleInputChange}
					placeholder="Bachelor of Science"
					required
				/>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Period of Course</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="periodOfCourse.startDate">
							Start Date *
						</Label>
						<Input
							id="periodOfCourse.startDate"
							name="periodOfCourse.startDate"
							type="month"
							value={formData.periodOfCourse.startDate}
							onChange={handleInputChange}
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="periodOfCourse.endDate">End Date</Label>
						<Input
							id="periodOfCourse.endDate"
							name="periodOfCourse.endDate"
							type="month"
							value={formData.periodOfCourse.endDate}
							onChange={handleInputChange}
							disabled={formData.periodOfCourse.isOngoing}
						/>
					</div>
				</div>
				<div className="flex items-center space-x-2">
					<Checkbox
						id="isOngoing"
						checked={formData.periodOfCourse.isOngoing}
						onCheckedChange={(checked) =>
							setFormData((prev) => ({
								...prev,
								periodOfCourse: {
									...prev.periodOfCourse,
									isOngoing: Boolean(checked),
									endDate: checked
										? ""
										: prev.periodOfCourse.endDate,
								},
							}))
						}
					/>
					<Label htmlFor="isOngoing">Currently ongoing</Label>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Grades *</h3>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>Grade Type</Label>
						<Select
							value={formData.grades.type}
							onValueChange={(value: "cgpa" | "percentage") =>
								setFormData((prev) => ({
									...prev,
									grades: {
										...prev.grades,
										type: value,
										value: 0,
									},
								}))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select grade type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="cgpa">CGPA</SelectItem>
								<SelectItem value="percentage">
									Percentage
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label htmlFor="grades.value">
							{formData.grades.type === "cgpa"
								? "CGPA"
								: "Percentage"}{" "}
							*
						</Label>
						<Input
							id="grades.value"
							name="grades.value"
							type="number"
							step={
								formData.grades.type === "cgpa" ? "0.01" : "1"
							}
							min="0"
							max={formData.grades.type === "cgpa" ? "10" : "100"}
							value={formData.grades.value || ""}
							onChange={handleInputChange}
							placeholder={
								formData.grades.type === "cgpa" ? "8.5" : "85"
							}
							required
						/>
					</div>
				</div>
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Skills</h3>
				<div className="flex gap-2">
					<Input
						value={skillInput}
						onChange={(e) => setSkillInput(e.target.value)}
						placeholder="Add a skill"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addSkill();
							}
						}}
					/>
					<Button
						type="button"
						onClick={addSkill}
						variant="outline"
						size="sm"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				{(formData.skills || []).length > 0 && (
					<div className="flex flex-wrap gap-2">
						{formData.skills!.map((skill, index) => (
							<Badge key={index} variant="secondary">
								{skill}
							</Badge>
						))}
					</div>
				)}
			</div>

			<div className="space-y-4">
				<h3 className="text-lg font-medium">Courseworks</h3>
				<div className="flex gap-2">
					<Input
						value={courseworkInput}
						onChange={(e) => setCourseworkInput(e.target.value)}
						placeholder="Add coursework"
						onKeyDown={(e) => {
							if (e.key === "Enter") {
								e.preventDefault();
								addCoursework();
							}
						}}
					/>
					<Button
						type="button"
						onClick={addCoursework}
						variant="outline"
						size="sm"
					>
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				{(formData.courseworks || []).length > 0 && (
					<div className="flex flex-wrap gap-2">
						{formData.courseworks!.map((coursework, index) => (
							<Badge
								key={index}
								variant="outline"
								className="cursor-pointer"
								onClick={() => removeCoursework(coursework)}
							>
								{coursework} <X className="h-3 w-3 ml-1" />
							</Badge>
						))}
					</div>
				)}
			</div>

			<div className="flex gap-2 pt-4">
				<Button
					className="cursor-pointer"
					type="submit"
					disabled={isLoading}
				>
					{initialData?._id ? "Update" : "Add"} Education
				</Button>
				<Button
					type="button"
					variant="outline"
					className="cursor-pointer"
					onClick={onCancel}
					disabled={isLoading}
				>
					Cancel
				</Button>
			</div>
		</form>
	);
}
