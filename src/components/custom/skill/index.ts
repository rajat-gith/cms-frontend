// components/skills/index.ts
export { SkillCard } from "./SkillCard";
export { SkillForm } from "./SkillForm";
export { SkillsList } from "./SkillList";

// Re-export types for convenience
export type {
	Skill,
	CreateSkillData,
	UpdateSkillData,
} from "@/types/index";
export { SKILL_LEVELS, SKILL_CATEGORIES } from "@/types/index";

// Re-export utilities
export * from "@/utils/skills.utils";
