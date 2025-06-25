"use client";

import React from "react";
import { Project, ProjectFilters } from "@/types/index";
import ProjectCard from "./ProjectCard";

interface ProjectListProps {
  projects: Project[];
  filters: ProjectFilters;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

const ProjectList: React.FC<ProjectListProps> = ({
  projects,
  filters,
  onEdit,
  onDelete,
  loading = false,
}) => {
  const filterProjects = (projects: Project[], filters: ProjectFilters): Project[] => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const matchesSearch = 
          project.title.toLowerCase().includes(searchTerm) ||
          project.description?.toLowerCase().includes(searchTerm) ||
          project.role?.toLowerCase().includes(searchTerm) ||
          project.technologies.some(tech => tech.toLowerCase().includes(searchTerm)) ||
          project.achievements.some(achievement => achievement.toLowerCase().includes(searchTerm));
        
        if (!matchesSearch) return false;
      }

      // Project type filter
      if (filters.projectType && project.projectType !== filters.projectType) {
        return false;
      }

      // Technology filter
      if (filters.technologies.length > 0) {
        const hasMatchingTechnology = filters.technologies.some(filterTech =>
          project.technologies.includes(filterTech)
        );
        if (!hasMatchingTechnology) return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const projectStart = new Date(project.duration.startDate);
        const projectEnd = project.duration.endDate 
          ? new Date(project.duration.endDate) 
          : new Date(); // Use current date for ongoing projects

        if (filters.dateRange.start && projectEnd < filters.dateRange.start) {
          return false;
        }

        if (filters.dateRange.end && projectStart > filters.dateRange.end) {
          return false;
        }
      }

      return true;
    });
  };

  const filteredProjects = filterProjects(projects, filters);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white rounded-lg border shadow-sm animate-pulse">
            <div className="p-6">
              <div className="h-6 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded mb-4"></div>
              <div className="flex gap-2 mb-4">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
                <div className="h-6 bg-gray-200 rounded w-14"></div>
              </div>
            </div>
            <div className="px-6 py-4 bg-gray-50 border-t">
              <div className="flex gap-4">
                <div className="h-4 bg-gray-200 rounded w-12"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (filteredProjects.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
        </h3>
        <p className="text-gray-600 mb-4">
          {projects.length === 0 
            ? "Create your first project to get started."
            : "Try adjusting your search criteria or clear the filters."
          }
        </p>
        {projects.length > 0 && filteredProjects.length === 0 && (
          <button
            onClick={() => window.location.reload()} // This would be replaced with proper filter clearing
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Clear all filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Results Summary */}
      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        {filteredProjects.length !== projects.length && (
          <p className="text-sm text-blue-600">
            {projects.length - filteredProjects.length} projects filtered out
          </p>
        )}
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project._id}
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectList;