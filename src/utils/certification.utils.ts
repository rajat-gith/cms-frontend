// utils/certification.utils.ts
import type { Certification } from "@/types/index";

export const certificationUtils = {
	/**
	 * Check if a certification is expired
	 */
	isExpired: (certification: Certification): boolean => {
		if (certification.isExpired) return true;
		if (!certification.expirationDate) return false;
		return new Date(certification.expirationDate) < new Date();
	},

	/**
	 * Check if a certification is expiring soon (within 30 days)
	 */
	isExpiringSoon: (
		certification: Certification,
		daysThreshold = 30
	): boolean => {
		if (!certification.expirationDate) return false;
		const expirationDate = new Date(certification.expirationDate);
		const now = new Date();
		const thresholdDate = new Date(
			now.getTime() + daysThreshold * 24 * 60 * 60 * 1000
		);

		return expirationDate > now && expirationDate <= thresholdDate;
	},

	/**
	 * Get the status of a certification
	 */
	getStatus: (
		certification: Certification
	): "active" | "expired" | "expiring-soon" => {
		if (certificationUtils.isExpired(certification)) {
			return "expired";
		}
		if (certificationUtils.isExpiringSoon(certification)) {
			return "expiring-soon";
		}
		return "active";
	},

	/**
	 * Get all unique categories from certifications
	 */
	getCategories: (certifications: Certification[]): string[] => {
		const categories = certifications
			.map((cert) => cert.category)
			.filter((category): category is string => !!category);

		return Array.from(new Set(categories)).sort();
	},

	/**
	 * Get all unique skills from certifications
	 */
	getSkills: (certifications: Certification[]): string[] => {
		const skills = certifications.flatMap((cert) => cert.skills);
		return Array.from(new Set(skills)).sort();
	},

	/**
	 * Get all unique organizations from certifications
	 */
	getOrganizations: (certifications: Certification[]): string[] => {
		const organizations = certifications.map(
			(cert) => cert.issuingOrganization
		);
		return Array.from(new Set(organizations)).sort();
	},

	/**
	 * Filter certifications by various criteria
	 */
	filterCertifications: (
		certifications: Certification[],
		filters: {
			search?: string;
			status?: "all" | "active" | "expired" | "expiring-soon";
			category?: string;
			organization?: string;
		}
	): Certification[] => {
		return certifications.filter((cert) => {
			// Search filter
			if (filters.search) {
				const searchTerm = filters.search.toLowerCase();
				const matchesSearch =
					cert.name.toLowerCase().includes(searchTerm) ||
					cert.issuingOrganization
						.toLowerCase()
						.includes(searchTerm) ||
					cert.category?.toLowerCase().includes(searchTerm) ||
					cert.skills.some((skill) =>
						skill.toLowerCase().includes(searchTerm)
					);

				if (!matchesSearch) return false;
			}

			// Status filter
			if (filters.status && filters.status !== "all") {
				const status = certificationUtils.getStatus(cert);
				if (status !== filters.status) return false;
			}

			// Category filter
			if (filters.category && cert.category !== filters.category) {
				return false;
			}

			// Organization filter
			if (
				filters.organization &&
				cert.issuingOrganization !== filters.organization
			) {
				return false;
			}

			return true;
		});
	},

	/**
	 * Sort certifications by various criteria
	 */
	sortCertifications: (
		certifications: Certification[],
		sortBy: "name" | "issueDate" | "expirationDate" | "organization",
		order: "asc" | "desc" = "desc"
	): Certification[] => {
		const sorted = [...certifications].sort((a, b) => {
			let comparison = 0;

			switch (sortBy) {
				case "name":
					comparison = a.name.localeCompare(b.name);
					break;
				case "organization":
					comparison = a.issuingOrganization.localeCompare(
						b.issuingOrganization
					);
					break;
				case "issueDate":
					comparison =
						new Date(a.issueDate).getTime() -
						new Date(b.issueDate).getTime();
					break;
				case "expirationDate":
					if (!a.expirationDate && !b.expirationDate) comparison = 0;
					else if (!a.expirationDate) comparison = 1;
					else if (!b.expirationDate) comparison = -1;
					else
						comparison =
							new Date(a.expirationDate).getTime() -
							new Date(b.expirationDate).getTime();
					break;
			}

			return order === "desc" ? -comparison : comparison;
		});

		return sorted;
	},

	/**
	 * Get certification statistics
	 */
	getStatistics: (certifications: Certification[]) => {
		const total = certifications.length;
		const active = certifications.filter(
			(cert) => certificationUtils.getStatus(cert) === "active"
		).length;
		const expired = certifications.filter(
			(cert) => certificationUtils.getStatus(cert) === "expired"
		).length;
		const expiringSoon = certifications.filter(
			(cert) => certificationUtils.getStatus(cert) === "expiring-soon"
		).length;

		const categoryCounts = certifications.reduce(
			(acc, cert) => {
				if (cert.category) {
					acc[cert.category] = (acc[cert.category] || 0) + 1;
				}
				return acc;
			},
			{} as Record<string, number>
		);

		const organizationCounts = certifications.reduce(
			(acc, cert) => {
				acc[cert.issuingOrganization] =
					(acc[cert.issuingOrganization] || 0) + 1;
				return acc;
			},
			{} as Record<string, number>
		);

		return {
			total,
			active,
			expired,
			expiringSoon,
			categoryCounts,
			organizationCounts,
		};
	},

	/**
	 * Validate certification URL
	 */
	isValidUrl: (url: string): boolean => {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	},

	/**
	 * Format date for display
	 */
	formatDate: (
		dateString: string,
		format: "short" | "long" = "short"
	): string => {
		const date = new Date(dateString);

		if (format === "long") {
			return date.toLocaleDateString("en-US", {
				year: "numeric",
				month: "long",
				day: "numeric",
			});
		}

		return date.toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
		});
	},

	/**
	 * Calculate days until expiration
	 */
	getDaysUntilExpiration: (certification: Certification): number | null => {
		if (!certification.expirationDate) return null;

		const expirationDate = new Date(certification.expirationDate);
		const now = new Date();
		const diffTime = expirationDate.getTime() - now.getTime();
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	},
};
