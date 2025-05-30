// hooks/useEducationForm.ts
import { useState, useCallback } from "react";
import {
	EducationFormData,
	initialEducationFormData,
} from "@/types/education-form";

export function useEducationForm() {
	const [formData, setFormData] = useState<EducationFormData>(
		initialEducationFormData
	);
	const [skillInput, setSkillInput] = useState("");
	const [courseworkInput, setCourseworkInput] = useState("");
	const [isAddingNew, setIsAddingNew] = useState(false);
	const [editingId, setEditingId] = useState<string | null>(null);

	const handleInputChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
		},
		[]
	);

	const handleOngoingChange = useCallback((checked: boolean) => {
		setFormData((prev) => ({
			...prev,
			periodOfCourse: {
				...prev.periodOfCourse,
				isOngoing: checked,
				endDate: checked ? "" : prev.periodOfCourse.endDate,
			},
		}));
	}, []);

	const handleGradeTypeChange = useCallback(
		(value: "cgpa" | "percentage") => {
			setFormData((prev) => ({
				...prev,
				grades: {
					...prev.grades,
					type: value,
					value: 0,
				},
			}));
		},
		[]
	);

	const addSkill = useCallback(() => {
		if (
			skillInput.trim() &&
			!formData.skills?.includes(skillInput.trim())
		) {
			setFormData((prev) => ({
				...prev,
				skills: [...(prev.skills || []), skillInput.trim()],
			}));
			setSkillInput("");
		}
	}, [skillInput, formData.skills]);

	const removeSkill = useCallback((skill: string) => {
		setFormData((prev) => ({
			...prev,
			skills: prev.skills?.filter((s) => s !== skill) || [],
		}));
	}, []);

	const addCoursework = useCallback(() => {
		if (
			courseworkInput.trim() &&
			!formData.courseworks?.includes(courseworkInput.trim())
		) {
			setFormData((prev) => ({
				...prev,
				courseworks: [
					...(prev.courseworks || []),
					courseworkInput.trim(),
				],
			}));
			setCourseworkInput("");
		}
	}, [courseworkInput, formData.courseworks]);

	const removeCoursework = useCallback((coursework: string) => {
		setFormData((prev) => ({
			...prev,
			courseworks:
				prev.courseworks?.filter((c) => c !== coursework) || [],
		}));
	}, []);

	const resetForm = useCallback(() => {
		setFormData(initialEducationFormData);
		setIsAddingNew(false);
		setEditingId(null);
		setSkillInput("");
		setCourseworkInput("");
	}, []);

	const setEditingData = useCallback((education: any) => {
		setFormData({
			...education,
			skills: education.skills || [],
			courseworks: education.courseworks || [],
		});
		setEditingId(education._id);
		setIsAddingNew(true);
	}, []);

	const validateForm = useCallback(() => {
		if (
			!formData.courseName ||
			!formData.institute ||
			!formData.degree ||
			!formData.periodOfCourse.startDate ||
			formData.grades.value <= 0
		) {
			return false;
		}
		return true;
	}, [formData]);

	return {
		formData,
		setFormData,
		skillInput,
		setSkillInput,
		courseworkInput,
		setCourseworkInput,
		isAddingNew,
		setIsAddingNew,
		editingId,
		setEditingId,
		handleInputChange,
		handleOngoingChange,
		handleGradeTypeChange,
		addSkill,
		removeSkill,
		addCoursework,
		removeCoursework,
		resetForm,
		setEditingData,
		validateForm,
	};
}
