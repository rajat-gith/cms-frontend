"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import { Project, ProjectFormData, TeamMember } from "@/types/index";

interface ProjectFormProps {
	project?: Project;
	onSubmit: (data: ProjectFormData) => Promise<void>;
	onCancel: () => void;
	isLoading?: boolean;
}

const ProjectForm: React.FC<ProjectFormProps> = ({
	project,
	onSubmit,
	onCancel,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState<ProjectFormData>({
		title: "",
		description: "",
		technologies: [],
		role: "",
		teamSize: 1,
		projectType: "individual",
		teamMembers: [],
		otherLinks: "",
		repositoryLink: "",
		liveDemoLink: "",
		achievements: [],
		duration: {
			startDate: new Date(),
			endDate: undefined,
			isOngoing: false,
		},
	});

	const [newTechnology, setNewTechnology] = useState("");
	const [newAchievement, setNewAchievement] = useState("");

	useEffect(() => {
		if (project) {
			setFormData({
				title: project.title,
				description: project.description || "",
				technologies: project.technologies,
				role: project.role || "",
				teamSize: project.teamSize || 1,
				projectType: project.projectType,
				teamMembers: project.teamMembers,
				otherLinks: project.otherLinks || "",
				repositoryLink: project.repositoryLink || "",
				liveDemoLink: project.liveDemoLink || "",
				achievements: project.achievements,
				duration: {
					startDate: new Date(project.duration.startDate),
					endDate: project.duration.endDate
						? new Date(project.duration.endDate)
						: undefined,
					isOngoing: project.duration.isOngoing,
				},
			});
		}
	}, [project]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		console.log(formData);
		await onSubmit(formData);
	};

	const addTechnology = () => {
		if (
			newTechnology.trim() &&
			!formData.technologies.includes(newTechnology.trim())
		) {
			setFormData({
				...formData,
				technologies: [...formData.technologies, newTechnology.trim()],
			});
			setNewTechnology("");
		}
	};

	const removeTechnology = (tech: string) => {
		setFormData({
			...formData,
			technologies: formData.technologies.filter((t) => t !== tech),
		});
	};

	const addAchievement = () => {
		if (newAchievement.trim()) {
			setFormData({
				...formData,
				achievements: [...formData.achievements, newAchievement.trim()],
			});
			setNewAchievement("");
		}
	};

	const removeAchievement = (index: number) => {
		setFormData({
			...formData,
			achievements: formData.achievements.filter((_, i) => i !== index),
		});
	};

	const addTeamMember = () => {
		const newMember: TeamMember = {
			name: "",
			linkedinURL: "",
			twitterURL: "",
			otherLinks: [],
			_id: "",
		};
		setFormData({
			...formData,
			teamMembers: [...formData.teamMembers, newMember],
		});
	};

	const updateTeamMember = (
		index: number,
		field: keyof TeamMember,
		value: string
	) => {
		const updatedMembers = [...formData.teamMembers];
		updatedMembers[index] = { ...updatedMembers[index], [field]: value };
		setFormData({ ...formData, teamMembers: updatedMembers });
	};

	const removeTeamMember = (index: number) => {
		setFormData({
			...formData,
			teamMembers: formData.teamMembers.filter((_, i) => i !== index),
		});
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
				<div className="p-6 border-b">
					<div className="flex justify-between items-center">
						<h2 className="text-xl font-semibold">
							{project ? "Edit Project" : "Create New Project"}
						</h2>
						<button
							onClick={onCancel}
							className="p-2 hover:bg-gray-100 rounded-full"
						>
							<X size={20} />
						</button>
					</div>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-6">
					{/* Basic Information */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								Title *
							</label>
							<input
								type="text"
								required
								value={formData.title}
								onChange={(e) =>
									setFormData({
										...formData,
										title: e.target.value,
									})
								}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								Role
							</label>
							<input
								type="text"
								value={formData.role}
								onChange={(e) =>
									setFormData({
										...formData,
										role: e.target.value,
									})
								}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Description
						</label>
						<textarea
							rows={4}
							value={formData.description}
							onChange={(e) =>
								setFormData({
									...formData,
									description: e.target.value,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Project Type and Team Size */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								Project Type
							</label>
							<select
								value={formData.projectType}
								onChange={(e) =>
									setFormData({
										...formData,
										projectType: e.target.value as
											| "individual"
											| "group",
									})
								}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="individual">Individual</option>
								<option value="group">Group</option>
							</select>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								Team Size
							</label>
							<input
								type="number"
								min="1"
								value={formData.teamSize || ""}
								onChange={(e) => {
									const value = e.target.value;
									setFormData({
										...formData,
										teamSize:
											value === ""
												? undefined
												: parseInt(value),
									});
								}}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					{/* Technologies */}
					<div>
						<label className="block text-sm font-medium mb-2">
							Technologies
						</label>
						<div className="flex gap-2 mb-2">
							<input
								type="text"
								value={newTechnology}
								onChange={(e) =>
									setNewTechnology(e.target.value)
								}
								placeholder="Add technology"
								className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onKeyPress={(e) =>
									e.key === "Enter" &&
									(e.preventDefault(), addTechnology())
								}
							/>
							<button
								type="button"
								onClick={addTechnology}
								className="px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
							>
								<Plus size={16} />
							</button>
						</div>
						<div className="flex flex-wrap gap-2">
							{formData.technologies.map((tech) => (
								<span
									key={tech}
									className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
								>
									{tech}
									<button
										type="button"
										onClick={() => removeTechnology(tech)}
										className="hover:bg-blue-200 rounded-full p-0.5"
									>
										<X size={12} />
									</button>
								</span>
							))}
						</div>
					</div>

					{/* Links */}
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label className="block text-sm font-medium mb-2">
								Repository Link
							</label>
							<input
								type="url"
								value={formData.repositoryLink}
								onChange={(e) =>
									setFormData({
										...formData,
										repositoryLink: e.target.value,
									})
								}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
						<div>
							<label className="block text-sm font-medium mb-2">
								Live Demo Link
							</label>
							<input
								type="url"
								value={formData.liveDemoLink}
								onChange={(e) =>
									setFormData({
										...formData,
										liveDemoLink: e.target.value,
									})
								}
								className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium mb-2">
							Other Links
						</label>
						<input
							type="text"
							value={formData.otherLinks}
							onChange={(e) =>
								setFormData({
									...formData,
									otherLinks: e.target.value,
								})
							}
							className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>

					{/* Duration */}
					<div>
						<label className="block text-sm font-medium mb-2">
							Duration
						</label>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
							<div>
								<label className="block text-xs text-gray-600 mb-1">
									Start Date
								</label>
								<input
									type="date"
									required
									value={
										formData.duration.startDate
											.toISOString()
											.split("T")[0]
									}
									onChange={(e) =>
										setFormData({
											...formData,
											duration: {
												...formData.duration,
												startDate: new Date(
													e.target.value
												),
											},
										})
									}
									className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								/>
							</div>
							<div>
								<label className="block text-xs text-gray-600 mb-1">
									End Date
								</label>
								<input
									type="date"
									disabled={formData.duration.isOngoing}
									value={
										formData.duration.endDate
											?.toISOString()
											.split("T")[0] || ""
									}
									onChange={(e) =>
										setFormData({
											...formData,
											duration: {
												...formData.duration,
												endDate: e.target.value
													? new Date(e.target.value)
													: undefined,
											},
										})
									}
									className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
								/>
							</div>
							<div className="flex items-center">
								<label className="flex items-center gap-2">
									<input
										type="checkbox"
										checked={formData.duration.isOngoing}
										onChange={(e) =>
											setFormData({
												...formData,
												duration: {
													...formData.duration,
													isOngoing: e.target.checked,
												},
											})
										}
										className="w-4 h-4 text-blue-600"
									/>
									<span className="text-sm">Ongoing</span>
								</label>
							</div>
						</div>
					</div>

					{/* Achievements */}
					<div>
						<label className="block text-sm font-medium mb-2">
							Achievements
						</label>
						<div className="flex gap-2 mb-2">
							<input
								type="text"
								value={newAchievement}
								onChange={(e) =>
									setNewAchievement(e.target.value)
								}
								placeholder="Add achievement"
								className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								onKeyPress={(e) =>
									e.key === "Enter" &&
									(e.preventDefault(), addAchievement())
								}
							/>
							<button
								type="button"
								onClick={addAchievement}
								className="px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700"
							>
								<Plus size={16} />
							</button>
						</div>
						<div className="space-y-2">
							{formData.achievements.map((achievement, index) => (
								<div
									key={index}
									className="flex items-center gap-2 p-2 bg-green-50 rounded-md"
								>
									<span className="flex-1 text-sm">
										{achievement}
									</span>
									<button
										type="button"
										onClick={() => removeAchievement(index)}
										className="p-1 hover:bg-green-200 rounded"
									>
										<Trash2 size={16} />
									</button>
								</div>
							))}
						</div>
					</div>

					{/* Team Members */}
					{formData.projectType === "group" && (
						<div>
							<div className="flex justify-between items-center mb-4">
								<label className="block text-sm font-medium">
									Team Members
								</label>
								<button
									type="button"
									onClick={addTeamMember}
									className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
								>
									Add Member
								</button>
							</div>
							<div className="space-y-4">
								{formData.teamMembers.map((member, index) => (
									<div
										key={index}
										className="p-4 border border-gray-200 rounded-md"
									>
										<div className="flex justify-between items-start mb-3">
											<h4 className="font-medium">
												Team Member {index + 1}
											</h4>
											<button
												type="button"
												onClick={() =>
													removeTeamMember(index)
												}
												className="p-1 hover:bg-red-100 rounded text-red-600"
											>
												<Trash2 size={16} />
											</button>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
											<input
												type="text"
												placeholder="Name"
												value={member.name}
												onChange={(e) =>
													updateTeamMember(
														index,
														"name",
														e.target.value
													)
												}
												className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<input
												type="url"
												placeholder="LinkedIn URL"
												value={member.linkedinURL || ""}
												onChange={(e) =>
													updateTeamMember(
														index,
														"linkedinURL",
														e.target.value
													)
												}
												className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
											<input
												type="url"
												placeholder="Twitter URL"
												value={member.twitterURL || ""}
												onChange={(e) =>
													updateTeamMember(
														index,
														"twitterURL",
														e.target.value
													)
												}
												className="p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Form Actions */}
					<div className="flex justify-end gap-4 pt-6 border-t">
						<button
							type="button"
							onClick={onCancel}
							className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isLoading}
							className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
								isLoading ? "opacity-50 cursor-not-allowed" : ""
							}`}
						>
							{isLoading
								? "Saving..."
								: project
									? "Update Project"
									: "Create Project"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default ProjectForm;
