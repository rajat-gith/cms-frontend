"use client";

import React from "react";
import { Edit, Trash2, ExternalLink, Github, Users, Calendar, Award } from "lucide-react";
import { Project } from "@/types/index";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit, onDelete }) => {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = formatDate(project.duration.startDate);
    const end = project.duration.isOngoing
      ? "Present"
      : project.duration.endDate
      ? formatDate(project.duration.endDate)
      : "Present";
    return `${start} - ${end}`;
  };

  // ✅ SAFE NORMALIZERS (prevents all crashes)
  const achievements =
    Array.isArray(project.achievements)
      ? project.achievements
      : typeof project.achievements === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(project.achievements);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  const otherLinks =
    Array.isArray(project.otherLinks)
      ? project.otherLinks
      : typeof project.otherLinks === "string"
      ? (() => {
          try {
            const parsed = JSON.parse(project.otherLinks);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })()
      : [];

  return (
    <div className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {project.title}
            </h3>
            {project.role && (
              <p className="text-sm text-blue-600 mb-2">{project.role}</p>
            )}
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => onEdit(project)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Edit Project"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(project._id)}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Delete Project"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Project Type and Team Size */}
        <div className="flex items-center gap-4 mb-3">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              project.projectType === "individual"
                ? "bg-green-100 text-green-800"
                : "bg-purple-100 text-purple-800"
            }`}
          >
            {project.projectType === "individual" ? "Individual" : "Group"}
          </span>

          {project.teamSize && project.teamSize > 1 && (
            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
              <Users size={14} />
              {project.teamSize} members
            </span>
          )}

          <span className="inline-flex items-center gap-1 text-sm text-gray-600">
            <Calendar size={14} />
            {getDuration()}
          </span>
        </div>

        {/* Description */}
        {project.description && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {project.description}
          </p>
        )}

        {/* Technologies */}
        {project.technologies?.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {project.technologies.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                >
                  {tech}
                </span>
              ))}
              {project.technologies.length > 5 && (
                <span className="inline-block px-2 py-1 bg-gray-100 text-gray-500 rounded text-xs">
                  +{project.technologies.length - 5} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* ✅ FIXED Achievements */}
        {achievements.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2 flex items-center gap-1">
              <Award size={14} />
              Key Achievements
            </h4>
            <ul className="space-y-1">
              {achievements.slice(0, 3).map((achievement, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 flex items-start gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0"></span>
                  {achievement}
                </li>
              ))}

              {achievements.length > 3 && (
                <li className="text-sm text-gray-500">
                  +{achievements.length - 3} more achievements
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Team Members */}
        {project.projectType === "group" && project.teamMembers?.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Team Members</h4>
            <div className="flex flex-wrap gap-2">
              {project.teamMembers.slice(0, 3).map((member, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-gray-700">{member.name}</span>
                </div>
              ))}
              {project.teamMembers.length > 3 && (
                <span className="text-sm text-gray-500">
                  +{project.teamMembers.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Footer with Links */}
      <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
        <div className="flex gap-3">
          {project.repositoryLink && (
            <a
              href={project.repositoryLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Github size={16} />
              Code
            </a>
          )}

          {project.liveDemoLink && (
            <a
              href={project.liveDemoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={16} />
              Live Demo
            </a>
          )}

          {otherLinks.length > 0 && (
            <a
              href={otherLinks[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ExternalLink size={16} />
              More
            </a>
          )}
        </div>

        <div className="text-xs text-gray-500">
          Updated {new Date(project.updatedAt).toLocaleDateString()}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
