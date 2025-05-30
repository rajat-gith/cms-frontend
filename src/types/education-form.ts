// types/education-form.ts
import { Education } from "@/types";

export interface EducationFormData extends Omit<Education, "_id"> {
	_id?: string;
}

export const initialEducationFormData: EducationFormData = {
	courseName: "",
	institute: "",
	degree: "",
	periodOfCourse: {
		startDate: "",
		endDate: "",
		isOngoing: false,
	},
	skills: [],
	courseworks: [],
	grades: {
		type: "cgpa",
		value: 0,
	},
};
