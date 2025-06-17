// components/certification/CertificationForm.tsx
import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	X,
	Plus,
	Loader2,
	Calendar,
	Building2,
	Award,
	Link,
} from "lucide-react";
import type { CertificationFormProps } from "@/types/index";

const certificationSchema = z.object({
	name: z.string().min(1, "Certification name is required"),
	issuingOrganization: z.string().min(1, "Issuing organization is required"),
	issueDate: z.string().min(1, "Issue date is required"),
	expirationDate: z.string().optional(),
	credentialId: z.string().optional(),
	credentialURL: z.string().url("Invalid URL").optional().or(z.literal("")),
	category: z.string().optional(),
	skills: z.array(z.string()).optional(),
});

export type CertificationFormData = z.infer<typeof certificationSchema>;

export const CertificationForm: React.FC<CertificationFormProps> = ({
	certification,
	onSubmit,
	onCancel,
	loading = false,
}) => {
	const [skillInput, setSkillInput] = useState("");
	const isEditing = !!certification;

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		watch,
		setValue,
		reset,
	} = useForm<CertificationFormData>({
		resolver: zodResolver(certificationSchema),
		defaultValues: {
			name: "",
			issuingOrganization: "",
			issueDate: "",
			expirationDate: "",
			credentialId: "",
			credentialURL: "",
			category: "",
			skills: [],
		},
	});

	const skills = watch("skills");

	useEffect(() => {
		if (certification) {
			reset({
				name: certification.name,
				issuingOrganization: certification.issuingOrganization,
				issueDate: certification.issueDate.split("T")[0],
				expirationDate: certification.expirationDate
					? certification.expirationDate.split("T")[0]
					: "",
				credentialId: certification.credentialId || "",
				credentialURL: certification.credentialURL || "",
				category: certification.category || "",
				skills: certification.skills,
			});
		}
	}, [certification, reset]);

	const addSkill = () => {
		const currentSkills = skills ?? [];
		const trimmed = skillInput.trim();
		if (trimmed && !currentSkills.includes(trimmed)) {
			setValue("skills", [...currentSkills, trimmed]);
			setSkillInput("");
		}
	};

	const removeSkill = (skillToRemove: string) => {
		const currentSkills = skills ?? [];
		setValue(
			"skills",
			currentSkills.filter((skill) => skill !== skillToRemove)
		);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			addSkill();
		}
	};

	return (
		<Card className="w-full max-w-2xl mx-auto">
			<CardHeader>
				<CardTitle className="flex items-center text-xl">
					<Award className="h-5 w-5 mr-2" />
					{isEditing ? "Edit Certification" : "Add New Certification"}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="name"
									className="flex items-center"
								>
									<Award className="h-4 w-4 mr-1" />
									Certification Name *
								</Label>
								<Controller
									name="name"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="name"
											placeholder="e.g., AWS Certified Solutions Architect"
											className={
												errors.name
													? "border-red-500"
													: ""
											}
										/>
									)}
								/>
								{errors.name && (
									<p className="text-sm text-red-600">
										{errors.name.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="issuingOrganization"
									className="flex items-center"
								>
									<Building2 className="h-4 w-4 mr-1" />
									Issuing Organization *
								</Label>
								<Controller
									name="issuingOrganization"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="issuingOrganization"
											placeholder="e.g., Amazon Web Services"
											className={
												errors.issuingOrganization
													? "border-red-500"
													: ""
											}
										/>
									)}
								/>
								{errors.issuingOrganization && (
									<p className="text-sm text-red-600">
										{errors.issuingOrganization.message}
									</p>
								)}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label
									htmlFor="issueDate"
									className="flex items-center"
								>
									<Calendar className="h-4 w-4 mr-1" />
									Issue Date *
								</Label>
								<Controller
									name="issueDate"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="issueDate"
											type="date"
											className={
												errors.issueDate
													? "border-red-500"
													: ""
											}
										/>
									)}
								/>
								{errors.issueDate && (
									<p className="text-sm text-red-600">
										{errors.issueDate.message}
									</p>
								)}
							</div>

							<div className="space-y-2">
								<Label
									htmlFor="expirationDate"
									className="flex items-center"
								>
									<Calendar className="h-4 w-4 mr-1" />
									Expiration Date
								</Label>
								<Controller
									name="expirationDate"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="expirationDate"
											type="date"
											className={
												errors.expirationDate
													? "border-red-500"
													: ""
											}
										/>
									)}
								/>
								{errors.expirationDate && (
									<p className="text-sm text-red-600">
										{errors.expirationDate.message}
									</p>
								)}
							</div>
						</div>
					</div>

					{/* Additional Information */}
					<div className="space-y-4">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="credentialId">
									Credential ID
								</Label>
								<Controller
									name="credentialId"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="credentialId"
											placeholder="e.g., ABC123XYZ"
										/>
									)}
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="category">Category</Label>
								<Controller
									name="category"
									control={control}
									render={({ field }) => (
										<Input
											{...field}
											id="category"
											placeholder="e.g., Cloud Computing, Project Management"
										/>
									)}
								/>
							</div>
						</div>

						<div className="space-y-2">
							<Label
								htmlFor="credentialURL"
								className="flex items-center"
							>
								<Link className="h-4 w-4 mr-1" />
								Credential URL
							</Label>
							<Controller
								name="credentialURL"
								control={control}
								render={({ field }) => (
									<Input
										{...field}
										id="credentialURL"
										type="url"
										placeholder="https://..."
										className={
											errors.credentialURL
												? "border-red-500"
												: ""
										}
									/>
								)}
							/>
							{errors.credentialURL && (
								<p className="text-sm text-red-600">
									{errors.credentialURL.message}
								</p>
							)}
						</div>
					</div>

					{/* Skills */}
					<div className="space-y-3">
						<Label>Related Skills</Label>
						<div className="flex gap-2">
							<Input
								value={skillInput}
								onChange={(e) => setSkillInput(e.target.value)}
								onKeyPress={handleKeyPress}
								placeholder="Add a skill"
								className="flex-1"
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

						{(skills ?? []).length > 0 && (
							<div className="flex flex-wrap gap-2 mt-2">
								{(skills ?? []).map((skill, index) => (
									<Badge
										key={index}
										variant="secondary"
										className="flex items-center gap-1"
									>
										{skill}
										<button
											type="button"
											onClick={() => removeSkill(skill)}
											className="ml-1 hover:text-red-600"
										>
											<X className="h-3 w-3" />
										</button>
									</Badge>
								))}
							</div>
						)}
					</div>

					{/* Form Actions */}
					<div className="flex gap-3 pt-4 border-t">
						<Button
							type="button"
							variant="outline"
							onClick={onCancel}
							disabled={loading}
							className="flex-1"
						>
							Cancel
						</Button>
						<Button
							type="submit"
							disabled={!isValid || loading}
							className="flex-1"
						>
							{loading && (
								<Loader2 className="h-4 w-4 mr-2 animate-spin" />
							)}
							{isEditing
								? "Update Certification"
								: "Add Certification"}
						</Button>
					</div>
				</form>
			</CardContent>
		</Card>
	);
};
