"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Plus } from "lucide-react";
import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
	experienceFormSchema,
	type ExperienceFormData,
	intialExperienceFormData,
} from "@/types/experience-form";
import type { Experience } from "@/types";

interface ExperienceFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: ExperienceFormData) => void;
	initialData?: Experience | null;
	isLoading?: boolean;
}

const employmentTypes = [
	"Full-time",
	"Part-time",
	"Internship",
	"Contract",
	"Freelance",
	"Self-employed",
] as const;

export function ExperienceForm({
	isOpen,
	onClose,
	onSubmit,
	initialData,
	isLoading = false,
}: ExperienceFormProps) {
	const [techInput, setTechInput] = useState("");
	const [technologies, setTechnologies] = useState<string[]>([]);

	// Helper function to convert MongoDB date to HTML date input format (YYYY-MM-DD)
	const formatDateForInput = (dateString?: string): string => {
		if (!dateString) return "";
		try {
			const date = new Date(dateString);
			return date.toISOString().split("T")[0];
		} catch {
			return "";
		}
	};

	const form = useForm<ExperienceFormData>({
		resolver: zodResolver(experienceFormSchema),
		defaultValues: {
			title: "",
			company: "",
			location: "",
			employmentType: "Full-time",
			period: {
				startDate: "",
				endDate: "",
				ongoing: false,
			},
			description: "",
			technologiesUsed: [],
		},
	});

	React.useEffect(() => {
		if (isOpen) {
			const techs = initialData?.technologiesUsed || [];
			setTechnologies(techs);

			form.reset({
				title: initialData?.title || "",
				company: initialData?.company || "",
				location: initialData?.location || "",
				employmentType: initialData?.employmentType || "Full-time",
				period: {
					startDate: formatDateForInput(
						initialData?.period.startDate
					),
					endDate: formatDateForInput(initialData?.period.endDate),
					ongoing: initialData?.period.ongoing || false,
				},
				description: initialData?.description || "",
				technologiesUsed: techs,
			});
		} else {
			setTechnologies([]);
			form.reset(intialExperienceFormData);
		}
	}, [isOpen, initialData, form]);

	const { watch, setValue } = form;
	const isOngoing = watch("period.ongoing");

	// Clear end date when ongoing is checked
	React.useEffect(() => {
		if (isOngoing) {
			setValue("period.endDate", "");
		}
	}, [isOngoing, setValue]);

	const handleAddTechnology = () => {
		if (techInput.trim() && !technologies.includes(techInput.trim())) {
			const newTechs = [...technologies, techInput.trim()];
			setTechnologies(newTechs);
			setValue("technologiesUsed", newTechs);
			setTechInput("");
		}
	};

	const handleRemoveTechnology = (tech: string) => {
		const newTechs = technologies.filter((t) => t !== tech);
		setTechnologies(newTechs);
		setValue("technologiesUsed", newTechs);
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault();
			handleAddTechnology();
		}
	};

	const handleFormSubmit = (data: ExperienceFormData) => {
		// Convert HTML date format back to ISO string for API
		const formattedData = {
			...data,
			period: {
				...data.period,
				startDate: data.period.startDate
					? new Date(data.period.startDate).toISOString()
					: "",
				endDate: data.period.endDate
					? new Date(data.period.endDate).toISOString()
					: undefined,
			},
			technologiesUsed: technologies,
		};
		onSubmit(formattedData);
	};

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>
						{initialData ? "Edit Experience" : "Add Experience"}
					</DialogTitle>
				</DialogHeader>

				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleFormSubmit)}
						className="space-y-6"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Job Title *</FormLabel>
										<FormControl>
											<Input
												placeholder="Software Engineer"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="company"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Company *</FormLabel>
										<FormControl>
											<Input
												placeholder="Tech Corp"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="location"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Location</FormLabel>
										<FormControl>
											<Input
												placeholder="San Francisco, CA"
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="employmentType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Employment Type *</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select employment type" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{employmentTypes.map((type) => (
													<SelectItem
														key={type}
														value={type}
													>
														{type}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="space-y-4">
							<FormField
								control={form.control}
								name="period.ongoing"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-x-3 space-y-0">
										<FormControl>
											<Checkbox
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>
												I currently work here
											</FormLabel>
										</div>
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="period.startDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Start Date *</FormLabel>
											<FormControl>
												<Input type="date" {...field} />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								{!isOngoing && (
									<FormField
										control={form.control}
										name="period.endDate"
										render={({ field }) => (
											<FormItem>
												<FormLabel>End Date</FormLabel>
												<FormControl>
													<Input
														type="date"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								)}
							</div>
						</div>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Describe your role and achievements..."
											className="min-h-[100px]"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-3">
							<FormLabel>Technologies Used</FormLabel>
							<div className="flex gap-2">
								<Input
									value={techInput}
									onChange={(e) =>
										setTechInput(e.target.value)
									}
									onKeyPress={handleKeyPress}
									placeholder="Add technology (e.g., React, Node.js)"
									className="flex-1"
								/>
								<Button
									type="button"
									onClick={handleAddTechnology}
									variant="outline"
									size="sm"
								>
									<Plus className="h-4 w-4" />
								</Button>
							</div>

							{technologies.length > 0 && (
								<div className="flex flex-wrap gap-2">
									{technologies.map((tech) => (
										<Badge
											key={tech}
											variant="secondary"
											className="text-sm"
										>
											{tech}
											<button
												type="button"
												onClick={() =>
													handleRemoveTechnology(tech)
												}
												className="ml-2 hover:text-red-600"
											>
												<X className="h-3 w-3" />
											</button>
										</Badge>
									))}
								</div>
							)}
						</div>

						<div className="flex justify-end gap-3 pt-4">
							<Button
								type="button"
								variant="outline"
								onClick={onClose}
								className="cursor-pointer"
							>
								Cancel
							</Button>
							<Button
								className="cursor-pointer"
								type="submit"
								disabled={isLoading}
							>
								{isLoading
									? "Saving..."
									: initialData
										? "Update"
										: "Add"}{" "}
								Experience
							</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
