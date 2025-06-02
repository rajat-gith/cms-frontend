// utils/education.ts
import { Education } from "@/types";

export function formatEducationDate(dateString: string): string {
	if (!dateString) return "";

	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
	});
}

export function validateEducationForm(education: Partial<Education>): string[] {
	const errors: string[] = [];

	if (!education.courseName?.trim()) {
		errors.push("Course name is required");
	}

	if (!education.institute?.trim()) {
		errors.push("Institute is required");
	}

	if (!education.degree?.trim()) {
		errors.push("Degree is required");
	}

	if (!education.periodOfCourse?.startDate) {
		errors.push("Start date is required");
	}

	if (!education.grades?.value || education.grades.value <= 0) {
		errors.push("Valid grade is required");
	}

	if (education.grades?.type === "cgpa" && education.grades.value > 10) {
		errors.push("CGPA cannot exceed 10");
	}

	if (
		education.grades?.type === "percentage" &&
		education.grades.value > 100
	) {
		errors.push("Percentage cannot exceed 100");
	}

	return errors;
}

export function formatGradeDisplay(grades: Education["grades"]): string {
	const suffix = grades.type === "percentage" ? "%" : "";
	return `${grades.type.toUpperCase()}: ${grades.value}${suffix}`;
}

export function sortEducationByDate(educationList: Education[]): Education[] {
	return [...educationList].sort((a, b) => {
		const dateA = new Date(a.periodOfCourse.startDate);
		const dateB = new Date(b.periodOfCourse.startDate);
		return dateB.getTime() - dateA.getTime(); // Most recent first
	});
}
