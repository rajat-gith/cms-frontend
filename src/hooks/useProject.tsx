// hooks/useProjects.ts
"use client";

import { useState, useCallback } from "react";
import { Project, ProjectFormData } from "@/types/index";
import { useUserModules } from "./useUserModules";
import { toast } from "sonner";
import { useUserModuleStore } from "@/store/user.store";

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { modules } = useUserModuleStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    fetchModule,
    createModuleItem,
    updateModuleItem,
    deleteModuleItem,
    loading: moduleLoading,
  } = useUserModules();

  const loadProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchModule("projects");
      setProjects(modules.projects);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load projects";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [fetchModule]);

  const createProject = useCallback(
    async (data: ProjectFormData): Promise<Project> => {
      setLoading(true);
      setError(null);
      try {
        const newProject = await createModuleItem("projects", data);
        setProjects((prev) => [newProject, ...prev]);
        toast.success("Project created successfully!");
        return newProject;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to create project";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [createModuleItem]
  );

  const updateProject = useCallback(
    async (id: string, data: Partial<ProjectFormData>): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await updateModuleItem("projects", id, data);
        setProjects((prev) =>
          prev.map((project) =>
            project._id === id
              ? { ...project, ...data, updatedAt: new Date() }
              : project
          )
        );
        toast.success("Project updated successfully!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to update project";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateModuleItem]
  );

  const deleteProject = useCallback(
    async (id: string): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await deleteModuleItem("projects", id);
        setProjects((prev) => prev.filter((project) => project._id !== id));
        toast.success("Project deleted successfully!");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete project";
        setError(errorMessage);
        toast.error(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [deleteModuleItem]
  );

  const duplicateProject = useCallback(
    async (project: Project): Promise<void> => {
      const duplicatedData: ProjectFormData = {
        title: `${project.title} (Copy)`,
        description: project.description,
        technologies: [...project.technologies],
        role: project.role,
        teamSize: project.teamSize,
        projectType: project.projectType,
        teamMembers: project.teamMembers.map((member) => ({ ...member })),
        otherLinks: project.otherLinks,
        repositoryLink: project.repositoryLink,
        liveDemoLink: project.liveDemoLink,
        achievements: [...project.achievements],
        duration: {
          startDate: new Date(),
          endDate: undefined,
          isOngoing: true,
        },
      };

      await createProject(duplicatedData);
    },
    [createProject]
  );

  const getProjectsByType = useCallback(
    (type: "individual" | "group") => {
      return projects.filter((project) => project.projectType === type);
    },
    [projects]
  );

  const getProjectsByTechnology = useCallback(
    (technology: string) => {
      return projects.filter((project) =>
        project.technologies.some((tech) =>
          tech.toLowerCase().includes(technology.toLowerCase())
        )
      );
    },
    [projects]
  );

  const getRecentProjects = useCallback(
    (limit: number = 5) => {
      return projects
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
        .slice(0, limit);
    },
    [projects]
  );

  const getProjectStats = useCallback(() => {
    const totalProjects = projects.length;
    const individualProjects = projects.filter(
      (p) => p.projectType === "individual"
    ).length;
    const groupProjects = projects.filter(
      (p) => p.projectType === "group"
    ).length;
    const ongoingProjects = projects.filter((p) => p.duration.isOngoing).length;
    const completedProjects = totalProjects - ongoingProjects;

    // Get unique technologies across all projects
    const allTechnologies = projects.flatMap((p) => p.technologies);
    const uniqueTechnologies = [...new Set(allTechnologies)];

    // Calculate average team size for group projects
    const groupProjectsWithTeam = projects.filter(
      (p) => p.projectType === "group" && p.teamSize
    );
    const averageTeamSize =
      groupProjectsWithTeam.length > 0
        ? groupProjectsWithTeam.reduce((sum, p) => sum + (p.teamSize || 0), 0) /
          groupProjectsWithTeam.length
        : 0;

    return {
      totalProjects,
      individualProjects,
      groupProjects,
      ongoingProjects,
      completedProjects,
      uniqueTechnologies: uniqueTechnologies.length,
      averageTeamSize: Math.round(averageTeamSize * 10) / 10, // Round to 1 decimal place
    };
  }, [projects]);

  const searchProjects = useCallback(
    (query: string) => {
      if (!query.trim()) return projects;
  
      const lowercaseQuery = query.toLowerCase();
  
      return projects.filter((project) => {
        const technologies = Array.isArray(project.technologies)
          ? project.technologies
          : [];
  
        const achievements = Array.isArray(project.achievements)
          ? project.achievements
          : [];
  
        return (
          project.title.toLowerCase().includes(lowercaseQuery) ||
          (project.description?.toLowerCase() ?? "").includes(lowercaseQuery) ||
          technologies.some((tech) =>
            tech.toLowerCase().includes(lowercaseQuery)
          ) ||
          (project.role?.toLowerCase() ?? "").includes(lowercaseQuery) ||
          achievements.some((achievement) =>
            achievement.toLowerCase().includes(lowercaseQuery)
          )
        );
      });
    },
    [projects]
  );
  

  const getProjectById = useCallback(
    (id: string) => {
      return projects.find((project) => project._id === id);
    },
    [projects]
  );

  return {
    // State
    projects,
    loading: loading || moduleLoading,
    error,

    // Actions
    loadProjects,
    createProject,
    updateProject,
    deleteProject,
    duplicateProject,

    // Utilities
    getProjectsByType,
    getProjectsByTechnology,
    getRecentProjects,
    getProjectStats,
    searchProjects,
    getProjectById,
  };
}
