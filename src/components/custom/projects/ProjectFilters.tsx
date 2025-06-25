"use client";

import React, { useState } from "react";
import { Search, Filter, X, Calendar } from "lucide-react";
import { ProjectFilters } from "@/types/index";

interface ProjectFiltersProps {
  filters: ProjectFilters;
  onFiltersChange: (filters: ProjectFilters) => void;
  availableTechnologies: string[];
}

const ProjectFiltersComponent: React.FC<ProjectFiltersProps> = ({
  filters,
  onFiltersChange,
  availableTechnologies,
}) => {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTech, setSelectedTech] = useState("");

  const handleSearchChange = (search: string) => {
    onFiltersChange({ ...filters, search });
  };

  const handleProjectTypeChange = (projectType: string) => {
    onFiltersChange({ ...filters, projectType });
  };

  const handleTechnologyAdd = () => {
    if (selectedTech && !filters.technologies.includes(selectedTech)) {
      onFiltersChange({
        ...filters,
        technologies: [...filters.technologies, selectedTech],
      });
      setSelectedTech("");
    }
  };

  const handleTechnologyRemove = (tech: string) => {
    onFiltersChange({
      ...filters,
      technologies: filters.technologies.filter((t) => t !== tech),
    });
  };

  const handleDateRangeChange = (field: "start" | "end", value: string) => {
    onFiltersChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: value ? new Date(value) : undefined,
      },
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: "",
      projectType: "",
      technologies: [],
      dateRange: {},
    });
  };

  const hasActiveFilters =
    filters.search ||
    filters.projectType ||
    filters.technologies.length > 0 ||
    filters.dateRange.start ||
    filters.dateRange.end;

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
      {/* Search Bar */}
      <div className="flex gap-4 items-center mb-4">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search projects..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
            showFilters || hasActiveFilters
              ? "bg-blue-50 border-blue-300 text-blue-700"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Filter size={16} />
          Filters
          {hasActiveFilters && (
            <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-0.5 ml-1">
              {
                [
                  filters.search && "search",
                  filters.projectType && "type",
                  filters.technologies.length > 0 && "tech",
                  (filters.dateRange.start || filters.dateRange.end) && "date",
                ].filter(Boolean).length
              }
            </span>
          )}
        </button>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Project Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Project Type
            </label>
            <select
              value={filters.projectType}
              onChange={(e) => handleProjectTypeChange(e.target.value)}
              className="w-full md:w-48 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="group">Group</option>
            </select>
          </div>

          {/* Technology Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Technologies
            </label>
            <div className="flex gap-2 mb-2">
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="flex-1 md:flex-none md:w-48 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select technology</option>
                {availableTechnologies
                  .filter((tech) => !filters.technologies.includes(tech))
                  .map((tech) => (
                    <option key={tech} value={tech}>
                      {tech}
                    </option>
                  ))}
              </select>
              <button
                onClick={handleTechnologyAdd}
                disabled={!selectedTech}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
            {filters.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {filters.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {tech}
                    <button
                      onClick={() => handleTechnologyRemove(tech)}
                      className="hover:bg-blue-200 rounded-full p-0.5"
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Date Range Filter */}
          <div>
            <label className="block text-sm font-medium mb-2">
              <Calendar size={16} className="inline mr-1" />
              Date Range
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={
                    filters.dateRange.start?.toISOString().split("T")[0] || ""
                  }
                  onChange={(e) =>
                    handleDateRangeChange("start", e.target.value)
                  }
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={
                    filters.dateRange.end?.toISOString().split("T")[0] || ""
                  }
                  onChange={(e) => handleDateRangeChange("end", e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="border-t pt-4 mt-4">
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                Search: "{filters.search}"
                <button
                  onClick={() => handleSearchChange("")}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {filters.projectType && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                Type: {filters.projectType}
                <button
                  onClick={() => handleProjectTypeChange("")}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
            {(filters.dateRange.start || filters.dateRange.end) && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                Date: {filters.dateRange.start?.toLocaleDateString()} -{" "}
                {filters.dateRange.end?.toLocaleDateString() || "Present"}
                <button
                  onClick={() => onFiltersChange({ ...filters, dateRange: {} })}
                  className="hover:bg-gray-200 rounded-full p-0.5"
                >
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFiltersComponent;
