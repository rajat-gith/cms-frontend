// components/certification/CertificationList.tsx
import React, { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Plus,
	Search,
	Filter,
	Award,
	AlertTriangle,
	Calendar,
} from "lucide-react";
import { CertificationCard } from "./CertificationCard";
import type { Certification } from "@/types/index";

interface CertificationListProps {
	certifications: Certification[];
	onAdd: () => void;
	onEdit: (certification: Certification) => void;
	onDelete: (id: string) => void;
	loading?: boolean;
}

type SortOption = "name" | "issueDate" | "expirationDate" | "organization";
type FilterOption = "all" | "active" | "expired" | "expiring-soon";

export const CertificationList: React.FC<CertificationListProps> = ({
	certifications,
	onAdd,
	onEdit,
	onDelete,
	loading = false,
}) => {
	const [searchTerm, setSearchTerm] = useState("");
	const [sortBy, setSortBy] = useState<SortOption>("issueDate");
	const [filterBy, setFilterBy] = useState<FilterOption>("all");
	console.log(certifications);

	const filteredAndSortedCertifications = useMemo(() => {
		const filtered = certifications.filter((cert) => {
			const matchesSearch =
				cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				cert.issuingOrganization
					.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				cert.category
					?.toLowerCase()
					.includes(searchTerm.toLowerCase()) ||
				cert.skills.some((skill) =>
					skill.toLowerCase().includes(searchTerm.toLowerCase())
				);

			if (!matchesSearch) return false;

			const now = new Date();
			const expirationDate = cert.expirationDate
				? new Date(cert.expirationDate)
				: null;
			const isExpired =
				cert.isExpired || (expirationDate && expirationDate < now);
			const isExpiringSoon =
				expirationDate &&
				expirationDate > now &&
				expirationDate <=
					new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days

			switch (filterBy) {
				case "active":
					return !isExpired;
				case "expired":
					return isExpired;
				case "expiring-soon":
					return isExpiringSoon;
				default:
					return true;
			}
		});

		// Sort the filtered results
		filtered.sort((a, b) => {
			switch (sortBy) {
				case "name":
					return a.name.localeCompare(b.name);
				case "organization":
					return a.issuingOrganization.localeCompare(
						b.issuingOrganization
					);
				case "issueDate":
					return (
						new Date(b.issueDate).getTime() -
						new Date(a.issueDate).getTime()
					);
				case "expirationDate":
					if (!a.expirationDate && !b.expirationDate) return 0;
					if (!a.expirationDate) return 1;
					if (!b.expirationDate) return -1;
					return (
						new Date(a.expirationDate).getTime() -
						new Date(b.expirationDate).getTime()
					);
				default:
					return 0;
			}
		});

		return filtered;
	}, [certifications, searchTerm, sortBy, filterBy]);

	const stats = useMemo(() => {
		const now = new Date();
		const active = certifications.filter((cert) => {
			const expirationDate = cert.expirationDate
				? new Date(cert.expirationDate)
				: null;
			return !cert.isExpired && (!expirationDate || expirationDate > now);
		}).length;

		const expired = certifications.filter((cert) => {
			const expirationDate = cert.expirationDate
				? new Date(cert.expirationDate)
				: null;
			return cert.isExpired || (expirationDate && expirationDate < now);
		}).length;

		const expiringSoon = certifications.filter((cert) => {
			const expirationDate = cert.expirationDate
				? new Date(cert.expirationDate)
				: null;
			return (
				expirationDate &&
				expirationDate > now &&
				expirationDate <=
					new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
			);
		}).length;

		return { total: certifications.length, active, expired, expiringSoon };
	}, [certifications]);

	if (loading) {
		return (
			<div className="space-y-4">
				<div className="animate-pulse">
					<div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
					<div className="grid gap-4">
						{[1, 2, 3].map((i) => (
							<div
								key={i}
								className="h-32 bg-gray-200 rounded"
							></div>
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header with Stats */}
			<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold text-gray-900 flex items-center">
						<Award className="h-6 w-6 mr-2" />
						Certifications
					</h2>
					<div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2">
						<Badge variant="outline" className="text-sm">
							{stats.total} Total
						</Badge>
						<Badge
							variant="outline"
							className="text-sm text-green-600"
						>
							{stats.active} Active
						</Badge>
						{stats.expired > 0 && (
							<Badge
								variant="outline"
								className="text-sm text-red-600"
							>
								{stats.expired} Expired
							</Badge>
						)}
						{stats.expiringSoon > 0 && (
							<Badge
								variant="outline"
								className="text-sm text-orange-600"
							>
								<AlertTriangle className="h-3 w-3 mr-1" />
								{stats.expiringSoon} Expiring Soon
							</Badge>
						)}
					</div>
				</div>

				<Button onClick={onAdd} className="w-full lg:w-auto">
					<Plus className="h-4 w-4 mr-2" />
					Add Certification
				</Button>
			</div>

			{/* Search and Filters */}
			<Card>
				<CardContent className="p-4">
					<div className="flex flex-col lg:flex-row gap-4">
						<div className="relative flex-1">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
							<Input
								placeholder="Search certifications..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>

						<div className="flex flex-col sm:flex-row gap-2">
							<Select
								value={sortBy}
								onValueChange={(value: SortOption) =>
									setSortBy(value)
								}
							>
								<SelectTrigger className="w-full sm:w-40">
									<Calendar className="h-4 w-4 mr-2" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="issueDate">
										Issue Date
									</SelectItem>
									<SelectItem value="name">Name</SelectItem>
									<SelectItem value="organization">
										Organization
									</SelectItem>
									<SelectItem value="expirationDate">
										Expiration
									</SelectItem>
								</SelectContent>
							</Select>

							<Select
								value={filterBy}
								onValueChange={(value: FilterOption) =>
									setFilterBy(value)
								}
							>
								<SelectTrigger className="w-full sm:w-40">
									<Filter className="h-4 w-4 mr-2" />
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">
										All Status
									</SelectItem>
									<SelectItem value="active">
										Active
									</SelectItem>
									<SelectItem value="expired">
										Expired
									</SelectItem>
									<SelectItem value="expiring-soon">
										Expiring Soon
									</SelectItem>
								</SelectContent>
							</Select>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Certifications Grid */}
			{filteredAndSortedCertifications.length === 0 ? (
				<Card>
					<CardContent className="p-8 text-center">
						<Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
						<h3 className="text-lg font-medium text-gray-900 mb-2">
							{searchTerm || filterBy !== "all"
								? "No certifications found"
								: "No certifications yet"}
						</h3>
						<p className="text-gray-600 mb-4">
							{searchTerm || filterBy !== "all"
								? "Try adjusting your search or filter criteria."
								: "Start building your certification portfolio by adding your first certification."}
						</p>
						{!searchTerm && filterBy === "all" && (
							<Button onClick={onAdd}>
								<Plus className="h-4 w-4 mr-2" />
								Add Your First Certification
							</Button>
						)}
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 lg:grid-cols-2">
					{filteredAndSortedCertifications.map((certification) => (
						<CertificationCard
							key={certification._id}
							certification={certification}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	);
};
