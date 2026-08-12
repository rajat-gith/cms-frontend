"use client";

import React, { useState, useEffect } from "react";
import { Plus, Download, Upload } from "lucide-react";
import { Project, ProjectFormData, ProjectFilters } from "@/types/index";
import { useUserModules } from "@/hooks/useUserModules";
import ProjectForm from "@/components/custom/projects/ProjectForm";
import ProjectFiltersComponent from "@/components/custom/projects/ProjectFilters";
import ProjectList from "@/components/custom/projects/ProjectList";
import { toast } from "sonner";
import { useUserModuleStore } from "@/store/user.store";

const ProjectsPage: React.FC = () => {
	const { modules } = useUserModuleStore();
	const projects = modules.projects;
	const [showForm, setShowForm] = useState(false);
	const [editingProject, setEditingProject] = useState<Project | null>(null);
	const [filters, setFilters] = useState<ProjectFilters>({
		search: "",
		projectType: "",
		technologies: [],
		dateRange: {},
	});

	const {
		fetchModule,
		createModuleItem,
		updateModuleItem,
		deleteModuleItem,
		loading,
		error,
	} = useUserModules();

	const availableTechnologies = React.useMemo(() => {
		const allTechs = projects.flatMap((project) => project.technologies);
		return [...new Set(allTechs)].sort();
	}, [projects]);

	useEffect(() => {
		loadProjects();
	}, []);

	const loadProjects = async () => {
		try {
			await fetchModule("projects");
			// Note: This would need to be connected to your store
			// For now, we'll use mock data
		} catch (err) {
			console.error("Failed to load projects:", err);
		}
	};

	const handleCreateProject = async (data: ProjectFormData) => {
		try {
			const newProject = await createModuleItem("projects", data);
			setShowForm(false);
			toast.success("Project created successfully!");
		} catch (err) {
			toast.error("Failed to create project");
			throw err;
		}
	};

	const handleUpdateProject = async (data: ProjectFormData) => {
		if (!editingProject) return;

		try {
			await updateModuleItem("projects", editingProject.id, data);
			setEditingProject(null);
			setShowForm(false);
			toast.success("Project updated successfully!");
		} catch (err) {
			toast.error("Failed to update project");
			throw err;
		}
	};

	const handleDeleteProject = async (id: string) => {
		if (!confirm("Are you sure you want to delete this project?")) return;

		try {
			await deleteModuleItem("projects", id);
			toast.success("Project deleted successfully!");
		} catch (err) {
			toast.error("Failed to delete project");
		}
	};

	const handleEditProject = (project: Project) => {
		setEditingProject(project);
		setShowForm(true);
	};

	const handleCloseForm = () => {
		setShowForm(false);
		setEditingProject(null);
	};

	const handleFormSubmit = async (data: ProjectFormData) => {
		if (editingProject) {
			await handleUpdateProject(data);
		} else {
			await handleCreateProject(data);
		}
	};

	const exportProjects = () => {
		const dataStr = JSON.stringify(projects, null, 2);
		const dataUri =
			"data:application/json;charset=utf-8," +
			encodeURIComponent(dataStr);

		const exportFileDefaultName = `projects-${new Date().toISOString().split("T")[0]}.json`;

		const linkElement = document.createElement("a");
		linkElement.setAttribute("href", dataUri);
		linkElement.setAttribute("download", exportFileDefaultName);
		linkElement.click();
	};

	return (
		<div className="max-w-7xl mx-auto p-4 sm:p-6">
			{/* Header */}
			<div className="mb-8">
				<div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
					<div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
							Projects
						</h1>
						<p className="text-gray-600 mt-2">
							Manage and showcase your projects
						</p>
					</div>
					<div className="flex flex-col sm:flex-row gap-3">
						<button
							onClick={exportProjects}
							className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
						>
							<Download size={16} />
							Export
						</button>
						<button
							onClick={() => setShowForm(true)}
							className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
						>
							<Plus size={16} />
							Add Project
						</button>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
					<div className="bg-white p-4 rounded-lg border">
						<div className="text-2xl font-bold text-blue-600">
							{projects.length}
						</div>
						<div className="text-sm text-gray-600">
							Total Projects
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border">
						<div className="text-2xl font-bold text-green-600">
							{
								projects.filter(
									(p) => p.projectType === "individual"
								).length
							}
						</div>
						<div className="text-sm text-gray-600">Individual</div>
					</div>
					<div className="bg-white p-4 rounded-lg border">
						<div className="text-2xl font-bold text-purple-600">
							{
								projects.filter(
									(p) => p.projectType === "group"
								).length
							}
						</div>
						<div className="text-sm text-gray-600">
							Group Projects
						</div>
					</div>
					<div className="bg-white p-4 rounded-lg border">
						<div className="text-2xl font-bold text-orange-600">
							{availableTechnologies.length}
						</div>
						<div className="text-sm text-gray-600">
							Technologies
						</div>
					</div>
				</div>
			</div>

			{/* Filters */}
			<ProjectFiltersComponent
				filters={filters}
				onFiltersChange={setFilters}
				availableTechnologies={availableTechnologies}
			/>

			{/* Error State */}
			{error && (
				<div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
					<div className="text-red-800">{error}</div>
				</div>
			)}

			{/* Project List */}
			<ProjectList
				projects={projects}
				filters={filters}
				onEdit={handleEditProject}
				onDelete={handleDeleteProject}
				loading={loading}
			/>

			{/* Form Modal */}
			{showForm && (
				<ProjectForm
					project={editingProject || undefined}
					onSubmit={handleFormSubmit}
					onCancel={handleCloseForm}
					isLoading={loading}
				/>
			)}
		</div>
	);
};

export default ProjectsPage;
